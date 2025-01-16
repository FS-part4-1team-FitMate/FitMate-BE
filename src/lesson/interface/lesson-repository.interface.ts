import type { LessonRequest, LessonRequestStatus } from '@prisma/client';
import type { CreateLesson, LessonResponse, PatchLesson } from '../type/lesson.type';

export interface ILessonRepository {
  create(data: CreateLesson): Promise<LessonResponse>;
  findAll(): Promise<LessonResponse[]>;
  findOne(id: string): Promise<LessonResponse | null>;
  update(id: string, data: PatchLesson): Promise<LessonResponse | null>;
  updateStatus(id: string, status: LessonRequestStatus): Promise<LessonResponse | null>;
}
