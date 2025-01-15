import { LessonQuote, QuoteStatus, Role } from '@prisma/client';
import { CreateLessonQuote, PatchLessonQuote } from '#quote/type/quote.type.js';

export interface IQuoteService {
  createLessonQuote(data: CreateLessonQuote, trainerId: string, userRole: string): Promise<LessonQuote>;
  acceptLessonQuote(id: string, userId: string): Promise<LessonQuote | null>;
  rejectLessonQuote(
    id: string,
    userId: string,
    status: QuoteStatus,
    rejectionReason?: string,
  ): Promise<LessonQuote | null>;
  getLessonQuotes(): Promise<LessonQuote[]>;
  getLessonQuoteById(id: string): Promise<LessonQuote | null>;
  updateLessonQuote(id: string, data: PatchLessonQuote): Promise<LessonQuote | null>;
}
