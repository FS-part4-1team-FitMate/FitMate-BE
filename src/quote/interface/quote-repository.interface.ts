import type { LessonQuote } from '@prisma/client';
import { Prisma, QuoteStatus, DirectQuoteRequestStatus } from '@prisma/client';
import { QueryQuoteDto } from '#quote/dto/quote.dto.js';
import type { CreateLessonQuote, LessonQuoteResponse, PatchLessonQuote } from '#quote/type/quote.type.js';

export interface IQuoteRepository {
  create(data: CreateLessonQuote): Promise<LessonQuote>;
  findQuotes(query: QueryQuoteDto): Promise<{ quotes: LessonQuote[]; totalCount: number; hasMore: boolean }>;
  findOne(id: string): Promise<LessonQuote | null>;
  updateStatus(id: string, status: QuoteStatus, rejectionReason?: string): Promise<LessonQuote | null>;
  updateStatusWithTx(
    tx: Prisma.TransactionClient,
    quoteId: string,
    status: QuoteStatus,
  ): Promise<LessonQuote>;
  findTrainerQuoteForLesson(lessonRequestId: string, trainerId: string): Promise<LessonQuote | null>;
  findDirectQuoteRequestTrainers(lessonRequestId: string): Promise<string[]>;
  findReviewableQuotes(userId: string, skip: number, take: number): Promise<LessonQuoteResponse[]>;
  countReviewableQuotes(userId: string): Promise<number>;
  updateDirectQuoteStatus({
    lessonRequestId,
    trainerId,
    status,
  }: {
    lessonRequestId: string;
    trainerId: string;
    status: DirectQuoteRequestStatus;
  }): Promise<void>;
}
