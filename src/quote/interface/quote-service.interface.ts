import type { LessonQuote } from '@prisma/client';
import { QuoteStatus } from '@prisma/client';
import { QueryQuoteDto } from '#quote/dto/quote.dto.js';
import type { CreateLessonQuote, LessonQuoteResponse, PatchLessonQuote } from '#quote/type/quote.type.js';

export interface IQuoteService {
  createLessonQuote(data: CreateLessonQuote, trainerId: string, userRole: string): Promise<LessonQuote>;
  acceptLessonQuote(id: string, userId: string): Promise<LessonQuote | null>;
  rejectLessonQuote(
    id: string,
    userId: string,
    status: QuoteStatus,
    rejectionReason?: string,
  ): Promise<LessonQuote | null>;
  getLessonQuotes(query: QueryQuoteDto): Promise<{
    list: LessonQuoteResponse[];
    totalCount: number;
    hasMore: boolean;
  }>;
  getLessonQuoteById(id: string): Promise<LessonQuoteResponse | null>;
  updateLessonQuote(id: string, data: PatchLessonQuote): Promise<LessonQuote | null>;
  hasTrainerSubmittedQuote(lessonRequestId: string, trainerId: string): Promise<boolean>;
  getReviewableQuotes(
    page?: number,
    limit?: number,
  ): Promise<{
    list: LessonQuote[];
    totalCount: number;
    hasMore: boolean;
  }>;
  hasTrainerSubmittedQuote(lessonRequestId: string, trainerId: string): Promise<boolean>;
}
