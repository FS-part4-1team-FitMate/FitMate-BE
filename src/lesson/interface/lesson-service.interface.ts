import { LessonRequestStatus } from '@prisma/client';
import { QueryLessonDto } from '#lesson/dto/lesson.dto.js';
import { CreateLesson, LessonResponse, PatchLesson } from '#lesson/type/lesson.type.js';

export interface ILessonService {
  createLesson(data: CreateLesson, userId: string, userRole: string): Promise<LessonResponse>;
  getLessonById(id: string): Promise<LessonResponse>;
  cancelLessonById(lessonId: string, userId: string): Promise<LessonResponse>;
  getLessons(
    query: QueryLessonDto,
    userId?: string,
  ): Promise<{ list: LessonResponse[]; totalCount: number; hasMore: boolean }>;
  updateLessonById(id: string, data: PatchLesson): Promise<LessonResponse>;
  updateLessonStatus(id: string, status: LessonRequestStatus): Promise<LessonResponse>;
}
