import type {
  DirectQuoteRequest,
  LessonRequest,
  LessonRequestStatus,
  LessonType,
  Prisma,
} from '@prisma/client';
import type { CreateLesson, LessonResponse, PatchLesson } from '../type/lesson.type';

export interface ILessonRepository {
  create(data: CreateLesson): Promise<LessonRequest>;
  findAll(): Promise<LessonResponse[]>;
  findLessonsByUserId(userId: string, status?: LessonRequestStatus): Promise<LessonRequest[]>;
  findOne(id: string): Promise<LessonResponse | null>;
  update(id: string, data: PatchLesson): Promise<LessonRequest | null>;
  updateStatus(id: string, status: LessonRequestStatus): Promise<LessonRequest | null>;
  createDirectQuoteRequest(data: { lessonRequestId: string; trainerId: string }): Promise<DirectQuoteRequest>;
}
