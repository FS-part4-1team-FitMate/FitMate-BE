import { Injectable } from '@nestjs/common';
import { DirectQuoteRequest, LessonRequest, LessonRequestStatus, Prisma } from '@prisma/client';
import { PrismaService } from '#prisma/prisma.service.js';
import { ILessonRepository } from './interface/lesson-repository.interface.js';
import { CreateLesson, LessonResponse, PatchLesson } from './type/lesson.type.js';

@Injectable()
export class LessonRepository implements ILessonRepository {
  private readonly lessonRequest;
  private readonly directQuoteRequest;
  constructor(private readonly prisma: PrismaService) {
    this.lessonRequest = prisma.lessonRequest;
    this.directQuoteRequest = prisma.directQuoteRequest;
  }

  async create(data: CreateLesson & { userId: string }): Promise<LessonRequest> {
    return await this.lessonRequest.create({ data });
  }

  async findAll(
    where: Record<string, any> = {},
    orderBy: Record<string, string> = { created_at: 'desc' },
    skip = 0,
    take = 10,
    select?: Prisma.LessonRequestSelect,
  ): Promise<LessonResponse[]> {
    const lessons = await this.lessonRequest.findMany({
      where,
      orderBy,
      skip,
      take,
      select,
    });
    return lessons as LessonResponse[];
  }

  async count(where: Record<string, any> = {}): Promise<number> {
    return await this.lessonRequest.count({
      where,
    });
  }

  async findLessonsByUserId(userId: string, status?: LessonRequestStatus): Promise<LessonRequest[]> {
    const whereClause: Prisma.LessonRequestWhereInput = { userId };
    if (status) {
      whereClause.status = status;
    }
    return await this.lessonRequest.findMany({ where: whereClause });
  }

  async findOne(id: string, select?: Prisma.LessonRequestSelect): Promise<LessonResponse | null> {
    const lesson = await this.lessonRequest.findUnique({ where: { id }, select });
    return lesson as LessonResponse | null;
  }

  async updateStatus(id: string, status: LessonRequestStatus): Promise<LessonRequest> {
    return await this.lessonRequest.update({ where: { id }, data: { status } });
  }

  async update(id: string, data: PatchLesson): Promise<LessonRequest> {
    return await this.lessonRequest.update({ where: { id }, data });
  }

  async findDirectQuoteRequest(
    lessonRequestId: string,
    trainerId: string,
  ): Promise<DirectQuoteRequest | null> {
    return await this.directQuoteRequest.findUnique({
      where: {
        lessonRequestId_trainerId: {
          lessonRequestId,
          trainerId,
        },
      },
    });
  }

  async createDirectQuoteRequest(data: {
    lessonRequestId: string;
    trainerId: string;
  }): Promise<DirectQuoteRequest> {
    return await this.directQuoteRequest.create({ data });
  }
}
