import {
  LessonRequest,
  LessonRequestStatus,
  LessonSubType,
  LessonType,
  LocationType,
  Profile,
  Role,
} from '@prisma/client';

export type CreateLesson = {
  lessonType: LessonType;
  lessonSubType?: LessonSubType;
  startDate: Date;
  endDate: Date;
  lessonCount: number;
  lessonTime: number;
  quoteEndDate: Date;
  locationType: LocationType;
  postcode?: string;
  roadAddress?: string;
  detailAddress?: string;
};

export type PatchLesson = Partial<CreateLesson>;

export type LessonResponse = LessonRequest & {
  // user?: {
  //   profile?: Profile;
  // };
  user?: {
    // Prisma에서 오는 필드 전부
    id: string;
    nickname: string;
    profile?: Profile;
  };
  directQuoteRequests?: {
    trainerId: string;
  }[];
  isDirectQuote?: boolean;
};

export type UpdateLessonStatus = {
  status: LessonRequestStatus;
};
