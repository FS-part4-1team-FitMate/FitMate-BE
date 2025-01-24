import { LessonQuote, Prisma, QuoteStatus } from '@prisma/client';
import { CreateLessonQuote, PatchLessonQuote } from '#quote/type/quote.type.js';

export interface IQuoteRepository {
  create(data: CreateLessonQuote): Promise<LessonQuote>;
  findAll(
    where?: Record<string, any>,
    orderBy?: Record<string, string>,
    skip?: number,
    take?: number,
    select?: Prisma.LessonQuoteSelect,
  ): Promise<LessonQuote[]>;
  findOne(id: string): Promise<LessonQuote | null>;
  update(id: string, data: PatchLessonQuote): Promise<LessonQuote | null>;
  updateStatus(id: string, status: QuoteStatus, rejectionReason?: string): Promise<LessonQuote | null>;
  findTrainerQuoteForLesson(lessonRequestId: string, trainerId: string): Promise<LessonQuote | null>;
  findDirectQuoteRequestTrainers(lessonRequestId: string): Promise<string[]>;
  findReviewableQuotes(userId: string, skip: number, take: number): Promise<LessonQuote[]>;
  countReviewableQuotes(userId: string): Promise<number>;
}
