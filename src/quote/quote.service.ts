import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { LessonQuote } from '@prisma/client';
import { LessonRequestStatus, QuoteStatus } from '@prisma/client';
import { PrismaService } from '#prisma/prisma.service.js';
import { AlsStore } from '#common/als/store-validator.js';
import AuthExceptionMessage from '#exception/auth-exception-message.js';
import LessonExceptionMessage from '#exception/lesson-exception-message.js';
import QuoteExceptionMessage from '#exception/quote-exception-message.js';
import { LessonService } from '#lesson/lesson.service.js';
import { QueryQuoteDto } from './dto/quote.dto.js';
import { IQuoteService } from './interface/quote-service.inteface.js';
import { QuoteRepository } from './quote.repository.js';
import { CreateLessonQuote, PatchLessonQuote } from './type/quote.type.js';

@Injectable()
export class QuoteService implements IQuoteService {
  constructor(
    private readonly quoteRepository: QuoteRepository,
    @Inject(forwardRef(() => LessonService)) // forwardRef로 주입
    private readonly lessonService: LessonService,
    private readonly alsStore: AlsStore,
    private readonly prisma: PrismaService,
  ) {}

  private getUserId(): string {
    const { userId } = this.alsStore.getStore();
    if (!userId) {
      throw new ForbiddenException(AuthExceptionMessage.UNAUTHORIZED);
    }
    return userId;
  }
  /*************************************************************************************
   * 레슨 견적 생성
   * ***********************************************************************************
   */
  async createLessonQuote(data: CreateLessonQuote): Promise<LessonQuote> {
    const { userId, userRole } = this.alsStore.getStore();
    if (userRole !== 'TRAINER') {
      throw new BadRequestException(QuoteExceptionMessage.ONLY_TRAINER_CAN_CREATE_QUOTE);
    }

    const lessonRequest = await this.lessonService.getLessonById(data.lessonRequestId);
    if (!lessonRequest) {
      throw new NotFoundException(LessonExceptionMessage.LESSON_NOT_FOUND);
    }

    // 지정 견적 요청에 포함되지 않은 일반 견적 개수 확인
    const nonDirectQuotesCount = await this.quoteRepository.count({
      lessonRequestId: data.lessonRequestId,
      trainerId: {
        notIn: await this.quoteRepository.findDirectQuoteRequestTrainers(data.lessonRequestId),
      },
    });

    // 최대 견적 제한 확인
    if (nonDirectQuotesCount >= 5) {
      throw new BadRequestException(QuoteExceptionMessage.QUOTE_LIMIT_REACHED);
    }
    return await this.quoteRepository.create({ ...data, trainerId: userId });
  }

  /*************************************************************************************
   * 레슨 견적 상태 업데이트 (확정)
   * ***********************************************************************************
   */
  async acceptLessonQuote(id: string): Promise<LessonQuote | null> {
    const userId = this.getUserId();
    const lessonQuote = await this.quoteRepository.findOne(id);

    if (!lessonQuote) {
      throw new NotFoundException(QuoteExceptionMessage.QUOTE_NOT_FOUND);
    }

    const lessonRequest = await this.lessonService.getLessonById(lessonQuote.lessonRequestId);

    if (lessonRequest.userId !== userId) {
      throw new ForbiddenException(QuoteExceptionMessage.NOT_AUTHORIZED_TO_ACCEPT_QUOTE);
    }

    if (lessonRequest.status != LessonRequestStatus.PENDING) {
      throw new BadRequestException(QuoteExceptionMessage.INVALID_LESSON_STATUS_FOR_ACCEPT);
    }

    if (lessonQuote.status !== QuoteStatus.PENDING) {
      throw new BadRequestException(QuoteExceptionMessage.INVALID_STATUS_TO_ACCEPT);
    }

    // 트랜잭션 처리
    const reusult = await this.prisma.$transaction(async (tx) => {
      const updatedQuote = await this.quoteRepository.updateStatusWithTx(tx, id, QuoteStatus.ACCEPTED);
      await this.lessonService.updateLessonStatusWithTx(
        tx,
        lessonQuote.lessonRequestId,
        LessonRequestStatus.QUOTE_CONFIRMED,
      );
      return updatedQuote;
    });
    return reusult;
  }

  /*************************************************************************************
   * 레슨 견적 상태 업데이트 (반려)
   * ***********************************************************************************
   */
  async rejectLessonQuote(id: string, rejectionReason?: string): Promise<LessonQuote | null> {
    const userId = this.getUserId();
    const lessonQuote = await this.quoteRepository.findOne(id);

    if (!lessonQuote) {
      throw new NotFoundException(QuoteExceptionMessage.QUOTE_NOT_FOUND);
    }

    const lessonRequest = await this.lessonService.getLessonById(lessonQuote.lessonRequestId);

    if (lessonRequest.userId !== userId) {
      throw new ForbiddenException(QuoteExceptionMessage.NOT_AUTHORIZED_TO_REJECT_QUOTE);
    }

    if (lessonQuote.status !== QuoteStatus.PENDING) {
      throw new BadRequestException(QuoteExceptionMessage.INVALID_STATUS_TO_REJECT);
    }

    // 프론트엔드 요청에 의해 반려 사유 옵션 처리
    // if (!rejectionReason?.trim()) {
    //   throw new BadRequestException(QuoteExceptionMessage.REJECTION_REASON_REQUIRED);
    // }

    return await this.quoteRepository.updateStatus(id, QuoteStatus.REJECTED, rejectionReason);
  }

  /*************************************************************************************
   * 레슨 견적 목록 조회
   * ***********************************************************************************
   */
  async getLessonQuotes(query: QueryQuoteDto): Promise<{
    list: LessonQuote[];
    totalCount: number;
    hasMore: boolean;
  }> {
    const {
      page = 1,
      limit = 5,
      order = 'createdAt',
      sort = 'desc',
      status,
      trainerId,
      minPrice,
      maxPrice,
      lessonRequestId,
    } = query.toCamelCase();

    const orderMapping: Record<string, string> = {
      created_at: 'createdAt', // 매핑된 필드 이름
      updated_at: 'updatedAt',
      price: 'price',
    };

    const orderByField = orderMapping[order] || order; // 매핑된 필드를 사용하거나 기본값 유지

    const orderBy: Record<string, string> = {
      [orderByField]: sort,
    };

    const skip = (page - 1) * limit;
    const take = limit;

    // 필터 조건 생성
    const where = {
      ...(status && { status: { in: status } }),
      ...(trainerId && { trainerId }),
      ...(lessonRequestId && { lessonRequestId }),
      ...(minPrice || maxPrice ? { price: { gte: minPrice || undefined, lte: maxPrice || undefined } } : {}),
    };

    const [quotes, totalCount] = await Promise.all([
      this.quoteRepository.findAll(where, orderBy, skip, take, {
        lessonRequest: true,
      }),
      this.quoteRepository.count(where),
    ]);

    return {
      list: quotes,
      totalCount,
      hasMore: totalCount > page * limit,
    };
  }

  /*************************************************************************************
   * 레슨 견적 상세 조회
   * ***********************************************************************************
   */
  async getLessonQuoteById(id: string): Promise<LessonQuote | null> {
    const lessonQuote = await this.quoteRepository.findOne(id);
    if (!lessonQuote) {
      throw new NotFoundException(QuoteExceptionMessage.QUOTE_NOT_FOUND);
    }
    return lessonQuote;
  }

  /*************************************************************************************
   * 레슨 견적 내용 수정 (진행중...)
   * ***********************************************************************************
   */
  async updateLessonQuote(id: string, data: PatchLessonQuote): Promise<LessonQuote | null> {
    const lessonQuote = await this.quoteRepository.findOne(id);
    if (!lessonQuote) {
      throw new NotFoundException(QuoteExceptionMessage.QUOTE_NOT_FOUND);
    }
    return await this.quoteRepository.update(id, data);
  }

  /*************************************************************************************
   * 리뷰 가능 견적 목록 조회
   * ***********************************************************************************
   */
  async getReviewableQuotes(
    page = 1,
    limit = 5,
  ): Promise<{
    list: LessonQuote[];
    totalCount: number;
    hasMore: boolean;
  }> {
    const skip = (page - 1) * limit;
    const { userId } = this.alsStore.getStore();

    const [quotes, totalCount] = await Promise.all([
      this.quoteRepository.findReviewableQuotes(userId, skip, limit),
      this.quoteRepository.countReviewableQuotes(userId),
    ]);

    return {
      list: quotes,
      totalCount,
      hasMore: totalCount > page * limit,
    };
  }
  /**
   * 특정 트레이너가 지정 견적 요청에 대해 이미 견적서를 제출했는지 확인 (lesson service 에서 사용)
   */
  async hasTrainerSubmittedQuote(lessonRequestId: string, trainerId: string): Promise<boolean> {
    const existingQuote = await this.quoteRepository.findTrainerQuoteForLesson(lessonRequestId, trainerId);
    return !!existingQuote;
  }
}
