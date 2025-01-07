import { LessonRequestStatus } from '@prisma/client';
import { CreateLesson, LessonResponse, PatchLesson } from '../type/lesson.type.js';

export interface ILessonService {
  createLesson(data: CreateLesson, userId: string): Promise<LessonResponse>;
  getLessonById(id: string): Promise<LessonResponse | null>;
  updateLessonById(id: string, data: PatchLesson): Promise<LessonResponse | null>;
  getLessons(): Promise<LessonResponse[]>;
  updateLessonStatus(id: string, status: LessonRequestStatus): Promise<LessonResponse | null>;
}
