import { Injectable } from '@nestjs/common';
import { LessonRequest, LessonRequestStatus } from '@prisma/client';
import { PrismaService } from '#prisma/prisma.service.js';
import { logger } from '#logger/winston-logger.js';
import { ILessonRepository } from './interface/lesson-repository.interface.js';
import { CreateLesson, PatchLesson } from './type/lesson.type.js';

@Injectable()
export class LessonRepository implements ILessonRepository {
  private readonly lessonRequest;
  constructor(private readonly prisma: PrismaService) {
    this.lessonRequest = prisma.lessonRequest;
  }

  async create(data: CreateLesson & { userId: string }): Promise<LessonRequest> {
    logger.debug('repo data', data);
    return this.lessonRequest.create({ data });
  }

  async findAll(): Promise<LessonRequest[]> {
    return this.lessonRequest.findMany();
  }

  async findOne(id: string): Promise<LessonRequest | null> {
    return this.lessonRequest.findUnique({ where: { id } });
  }

  async update(id: string, data: PatchLesson): Promise<LessonRequest | null> {
    return this.lessonRequest.update({ where: { id }, data });
  }

  async updateStatus(id: string, status: LessonRequestStatus): Promise<LessonRequest | null> {
    return this.lessonRequest.update({ where: { id }, data: { status } });
  }

  async delete(id: string): Promise<LessonRequest> {
    return this.lessonRequest.delete({ where: { id } });
  }
}
