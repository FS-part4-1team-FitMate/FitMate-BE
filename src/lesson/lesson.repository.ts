import { Injectable } from '@nestjs/common';
import { LessonRequest, LessonRequestStatus, Prisma } from '@prisma/client';
import { PrismaService } from '#prisma/prisma.service.js';
import { ILessonRepository } from './interface/lesson-repository.interface.js';
import { CreateLesson, PatchLesson } from './type/lesson.type.js';

@Injectable()
export class LessonRepository implements ILessonRepository {
  private readonly lessonRequest;
  constructor(private readonly prisma: PrismaService) {
    this.lessonRequest = prisma.lessonRequest;
  }

  async create(data: CreateLesson & { userId: string }): Promise<LessonRequest> {
    return this.lessonRequest.create({ data });
  }

  async findAll(
    where: Record<string, any> = {},
    orderBy: Record<string, string> = { created_at: 'desc' },
    skip = 0,
    take = 10,
  ): Promise<LessonRequest[]> {
    return this.lessonRequest.findMany({
      where,
      orderBy,
      skip,
      take,
    });
  }

  async count(where: Record<string, any> = {}): Promise<number> {
    return this.lessonRequest.count({
      where,
    });
  }

  async findLessonsByUserId(userId: string, status?: LessonRequestStatus): Promise<LessonRequest[]> {
    const whereClause: Prisma.LessonRequestWhereInput = { userId };
    if (status) {
      whereClause.status = status;
    }
    return this.lessonRequest.findMany({ where: whereClause });
  }

  async findOne(id: string): Promise<LessonRequest | null> {
    return this.lessonRequest.findUnique({ where: { id } });
  }

  async updateStatus(id: string, status: LessonRequestStatus): Promise<LessonRequest> {
    return this.lessonRequest.update({ where: { id }, data: { status } });
  }

  async update(id: string, data: PatchLesson): Promise<LessonRequest> {
    return this.lessonRequest.update({ where: { id }, data });
  }

  async delete(id: string): Promise<LessonRequest> {
    return this.lessonRequest.delete({ where: { id } });
  }
}
