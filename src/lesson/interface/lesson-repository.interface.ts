import type {
  DirectQuoteRequest,
  DirectQuoteRequestStatus,
  LessonRequest,
  LessonRequestStatus,
  Prisma,
} from '@prisma/client';
import type { CreateLesson, LessonResponse, PatchLesson } from '../type/lesson.type';

export interface ILessonRepository {
  create(data: CreateLesson & { userId: string }): Promise<LessonRequest>;
  findAll(
    where?: Record<string, any>,
    orderBy?: Record<string, string>,
    skip?: number,
    take?: number,
    select?: Prisma.LessonRequestSelect,
  ): Promise<LessonResponse[]>;
  count(where?: Record<string, any>): Promise<number>;
  findLessonsByUserId(userId: string, status?: LessonRequestStatus): Promise<LessonRequest[]>;
  findOne(id: string): Promise<LessonResponse | null>;
  updateStatus(id: string, status: LessonRequestStatus): Promise<LessonRequest>;
  update(id: string, data: PatchLesson): Promise<LessonRequest>;
  findDirectQuoteRequest(lessonRequestId: string, trainerId: string): Promise<DirectQuoteRequest | null>;
  createDirectQuoteRequest(data: { lessonRequestId: string; trainerId: string }): Promise<DirectQuoteRequest>;
  findDirectQuoteRequestById(id: string): Promise<DirectQuoteRequest | null>;
  updateDirectQuoteRequest(
    id: string,
    data: { status: DirectQuoteRequestStatus; rejectionReason?: string },
  ): Promise<DirectQuoteRequest>;
}
