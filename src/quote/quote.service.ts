import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { LessonRequestStatus, QuoteStatus } from '@prisma/client';
import type { LessonQuote, Prisma } from '@prisma/client';
import { PrismaService } from '#prisma/prisma.service.js';
import { AlsStore } from '#common/als/store-validator.js';
import AuthExceptionMessage from '#exception/auth-exception-message.js';
import LessonExceptionMessage from '#exception/lesson-exception-message.js';
import QuoteExceptionMessage from '#exception/quote-exception-message.js';
import { AuthService } from '#auth/auth.service.js';
import { LessonService } from '#lesson/lesson.service.js';
import type { QueryQuoteDto } from './dto/quote.dto.js';
import type { IQuoteService } from './interface/quote-service.interface.js';
import { QuoteRepository } from './quote.repository.js';
import type { CreateLessonQuote, LessonQuoteResponse, PatchLessonQuote } from './type/quote.type.js';

@Injectable()
export class QuoteService implements IQuoteService {
  constructor(
    private readonly quoteRepository: QuoteRepository,
    @Inject(forwardRef(() => LessonService)) // forwardRef로 주입
    private readonly lessonService: LessonService,
    private readonly alsStore: AlsStore,
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
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

    // 프로필을 등록한 트레이너만 견적을 생성할 수 있도록 제한
    if (!(await this.authService.hasProfile(userId))) {
      throw new BadRequestException(QuoteExceptionMessage.TRAINER_PROFILE_REQUIRED);
    }

    const lessonRequest = await this.lessonService.getLessonById(data.lessonRequestId);
    if (!lessonRequest) {
      throw new NotFoundException(LessonExceptionMessage.LESSON_NOT_FOUND);
    }

    // 1. 견적 마감일이 지났는지 확인
    const now = new Date();
    if (lessonRequest.quoteEndDate < now) {
      throw new BadRequestException(QuoteExceptionMessage.QUOTE_DEADLINE_PASSED);
    }

    // 2. 이미 해당 레슨에 견적을 제출했는지 확인
    const hasSubmittedQuote = lessonRequest.lessonQuotes?.some((quote) => quote.trainer.id === userId);
    if (hasSubmittedQuote) {
      throw new BadRequestException(QuoteExceptionMessage.TRAINER_ALREADY_SENT_QUOTE);
    }

    // 3. 지정 견적 여부 확인
    const isDirectQuote = lessonRequest.isDirectQuote;

    // 4. 지정 견적이 아닌 경우, 일반 견적 개수 확인
    if (!isDirectQuote) {
      const nonDirectQuotesCount = await this.quoteRepository.count({
        lessonRequestId: data.lessonRequestId,
        trainerId: {
          notIn: await this.quoteRepository.findDirectQuoteRequestTrainers(data.lessonRequestId),
        },
      });
      console.log('nonDirectQuotesCount', nonDirectQuotesCount);

      // 최대 견적 제한 확인
      if (nonDirectQuotesCount >= 5) {
        throw new BadRequestException(QuoteExceptionMessage.QUOTE_LIMIT_REACHED);
      }
    }

    // 5. 견적 생성
    const createdQuote = await this.quoteRepository.create({ ...data, trainerId: userId });

    // 6. 지정 견적 요청이었다면 지정견적요청 상태를 PROPOSED로 변경
    if (isDirectQuote) {
      await this.quoteRepository.updateDirectQuoteStatus({
        lessonRequestId: data.lessonRequestId,
        trainerId: userId,
        status: 'PROPOSED',
      });
    }

    return createdQuote;
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
  async getLessonQuotes(
    query: QueryQuoteDto,
  ): Promise<{ list: LessonQuoteResponse[]; totalCount: number; hasMore: boolean }> {
    const { quotes, totalCount, hasMore } = await this.quoteRepository.findQuotes(query);

    return {
      list: quotes,
      totalCount,
      hasMore,
    };
  }

  /*************************************************************************************
   * 레슨 견적 상세 조회
   * ***********************************************************************************
   */
  async getLessonQuoteById(id: string): Promise<LessonQuoteResponse | null> {
    const lessonQuote = await this.quoteRepository.findOne(id);
    if (!lessonQuote) {
      throw new NotFoundException(QuoteExceptionMessage.QUOTE_NOT_FOUND);
    }
    return lessonQuote;
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
