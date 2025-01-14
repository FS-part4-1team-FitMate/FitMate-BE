import { LessonQuote, QuoteStatus } from '@prisma/client';

export type CreateLessonQuote = {
  lessonRequestId: string;
  trainerId: string;
  price: number;
  message: string;
};

export type PatchLessonQuote = Partial<CreateLessonQuote>;

export type LessonQuoteResponse = LessonQuote;

export type UpdateLessonQuoteStatus = {
  id: string;
  userId: string;
  status: QuoteStatus;
  rejectionReason?: string;
};
