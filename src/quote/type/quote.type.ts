import { LessonQuote, QuoteStatus } from '@prisma/client';

export type CreateLessonQuote = {
  lessonRequestId: string;
  trainerId: string;
  price: number;
  message: string;
};

export type PatchLessonQuote = Partial<CreateLessonQuote>;

export type LessonQuoteResponse = LessonQuote;

