import type { DirectQuoteRequest, Gender, LessonRequest } from '@prisma/client';
import { DirectQuoteRequestStatus, LessonRequestStatus, Prisma } from '@prisma/client';
import { QueryLessonDto } from '#lesson/dto/lesson.dto.js';
import type { CreateLesson, LessonResponse, PatchLesson } from '#lesson/type/lesson.type.js';

export interface ILessonRepository {
  create(data: CreateLesson & { userId: string }): Promise<LessonRequest>;
  findLessonsByUserId(userId: string, status?: LessonRequestStatus): Promise<LessonRequest[]>;
  findLessons(
    query: QueryLessonDto,
    currentUserId: string,
    myLessonUserId?: string,
  ): Promise<{ lessons: LessonResponse[]; totalCount: number; hasMore: boolean }>;
  findOneById(id: string): Promise<LessonResponse | null>;
  updateStatus(id: string, status: LessonRequestStatus): Promise<LessonRequest>;
  updateLessonStatusWithTx(
    tx: Prisma.TransactionClient,
    lessonRequestId: string,
    status: LessonRequestStatus,
  ): Promise<void>;
  update(id: string, data: PatchLesson): Promise<LessonRequest>;
  findDirectQuoteRequest(lessonRequestId: string, trainerId: string): Promise<DirectQuoteRequest | null>;
  createDirectQuoteRequest(data: { lessonRequestId: string; trainerId: string }): Promise<DirectQuoteRequest>;
  findDirectQuoteRequestById(id: string): Promise<DirectQuoteRequest | null>;
  updateDirectQuoteRequest(
    id: string,
    data: { status: DirectQuoteRequestStatus; rejectionReason?: string },
  ): Promise<DirectQuoteRequest>;
  findDirectQuoteRequestByLessonId(lessonId: string): Promise<DirectQuoteRequest[]>;
  updateExpiredLesson(now: Date): Promise<{ count: number }>;
  updateCompletedLesson(now: Date): Promise<{ count: number }>;
  groupByLessonTypeAll(): Promise<
    Array<{
      lessonType: string; // 또는 LessonType
      count: number;
    }>
  >;
  groupByLessonTypeAll(): Promise<
    Array<{
      lessonType: string; // 또는 LessonType
      count: number;
    }>
  >;
  findAllForGenderCount(): Promise<
    Array<{
      id: string;
      user: {
        profile: {
          gender: Gender | null;
        } | null;
      };
      directQuoteRequests: {
        trainerId: string;
      }[];
    }>
  >;
}
