import type { LessonRequest, LessonRequestStatus } from '@prisma/client';
import type { CreateLesson, PatchLesson } from '../type/lesson.type';

export interface ILessonRepository {
  create(data: CreateLesson): Promise<LessonRequest>;
  findAll(): Promise<LessonRequest[]>;
  findOne(id: string): Promise<LessonRequest | null>;
  update(id: string, data: PatchLesson): Promise<LessonRequest | null>;
  updateStatus(id: string, status: LessonRequestStatus): Promise<LessonRequest | null>;
}
