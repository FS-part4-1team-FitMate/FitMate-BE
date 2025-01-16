import { DirectQuoteRequest, LessonRequestStatus } from '@prisma/client';
import { CreateDirectQuoteDto, QueryLessonDto } from '#lesson/dto/lesson.dto.js';
import { CreateLesson, LessonResponse, PatchLesson } from '#lesson/type/lesson.type.js';

export interface ILessonService {
  createLesson(data: CreateLesson): Promise<LessonResponse>;
  getLessonById(id: string): Promise<LessonResponse>;
  cancelLessonById(lessonId: string): Promise<LessonResponse>;
  getLessons(
    query: QueryLessonDto,
    userId?: string,
  ): Promise<{ list: LessonResponse[]; totalCount: number; hasMore: boolean }>;
  createDirectQuoteRequest(lessonId: string, data: CreateDirectQuoteDto): Promise<DirectQuoteRequest>;
  updateLessonById(id: string, data: PatchLesson): Promise<LessonResponse>;
  updateLessonStatus(id: string, status: LessonRequestStatus): Promise<LessonResponse>;
}
