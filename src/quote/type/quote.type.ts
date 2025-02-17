import type { LessonQuote } from '@prisma/client';

export type CreateLessonQuote = {
  lessonRequestId: string;
  trainerId: string;
  price: number;
  message: string;
};

export type PatchLessonQuote = Partial<CreateLessonQuote>;

export type LessonQuoteResponse = LessonQuote & {
  trainer: {
    id: string;
    email: string;
    nickname: string;
    profile: {
      name: string | null;
      profileImage: string | null;
    } | null;
  };
  lessonRequest: {
    user: {
      id: string;
      nickname: string;
    };
  };
};
