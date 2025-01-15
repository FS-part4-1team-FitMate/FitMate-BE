import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { LessonQuote, QuoteStatus } from '@prisma/client';
import { AlsStore } from '#common/als/store-validator.js';
import AuthExceptionMessage from '#exception/auth-exception-message.js';
import LessonExceptionMessage from '#exception/lesson-exception-message.js';
import QuoteExceptionMessage from '#exception/quote-exception-message.js';
import { LessonService } from '#lesson/lesson.service.js';
import { IQuoteService } from './interface/quote-service.inteface.js';
import { QuoteRepository } from './quote.repository.js';
import { CreateLessonQuote, PatchLessonQuote } from './type/quote.type.js';

@Injectable()
export class QuoteService implements IQuoteService {
  constructor(
    private readonly quoteRepository: QuoteRepository,
    private readonly lessonService: LessonService,
    private readonly alsStore: AlsStore,
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

    if (lessonQuote.status !== QuoteStatus.PENDING) {
      throw new BadRequestException(QuoteExceptionMessage.INVALID_STATUS_TO_ACCEPT);
    }

    return await this.quoteRepository.updateStatus(id, QuoteStatus.ACCEPTED);
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

    if (!rejectionReason?.trim()) {
      throw new BadRequestException(QuoteExceptionMessage.REJECTION_REASON_REQUIRED);
    }

    return await this.quoteRepository.updateStatus(id, QuoteStatus.REJECTED, rejectionReason);
  }

  /*************************************************************************************
   * 레슨 견적 목록 조회
   * ***********************************************************************************
   */
  async getLessonQuotes(): Promise<LessonQuote[]> {
    return await this.quoteRepository.findAll();
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
}
