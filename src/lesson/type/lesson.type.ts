import { LessonRequest, LessonRequestStatus, LessonSubType, LessonType, LocationType } from '@prisma/client';

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

export type LessonResponse = LessonRequest;

export type UpdateLessonStatus = {
  status: LessonRequestStatus;
};
