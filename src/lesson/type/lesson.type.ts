import {
  DirectQuoteRequestStatus,
  Gender,
  LessonRequest,
  LessonRequestStatus,
  LessonSubType,
  LessonType,
  LocationType,
  Region,
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
    id: string;
    lessonRequestId: string;
    trainerId: string;
    status: DirectQuoteRequestStatus;
    rejectionReason?: string | null;
  }[];
  lessonQuotes?: {
    id: string;
    trainer: {
      id: string;
      nickname: string;
      profile?: {
        name: string | null;
        region: Region[];
      } | null;
    };
  }[];
  isDirectQuote?: boolean;
};

export type UpdateLessonStatus = {
  status: LessonRequestStatus;
};
