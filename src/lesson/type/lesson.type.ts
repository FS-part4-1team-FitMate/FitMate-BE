import {
  Gender,
  LessonRequest,
  LessonRequestStatus,
  LessonSubType,
  LessonType,
  LocationType,
  Profile,
  Region,
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
  user?: {
    id: string;
    nickname: string;
    profile?: {
      name: string | null;
      gender: Gender;
      region: Region[];
    } | null;
  };
  directQuoteRequests?: {
    trainerId: string;
  }[];
  isDirectQuote?: boolean;
};

export type UpdateLessonStatus = {
  status: LessonRequestStatus;
};
