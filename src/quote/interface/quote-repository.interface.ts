import { LessonQuote, QuoteStatus } from '@prisma/client';
import { CreateLessonQuote, PatchLessonQuote } from '#quote/type/quote.type.js';

export interface IQuoteRepository {
  create(data: CreateLessonQuote): Promise<LessonQuote>;
  findAll(): Promise<LessonQuote[]>;
  findOne(id: string): Promise<LessonQuote | null>;
  update(id: string, data: PatchLessonQuote): Promise<LessonQuote | null>;
  updateStatus(id: string, status: QuoteStatus, rejectionReason?: string): Promise<LessonQuote | null>;
}
