import { Injectable } from '@nestjs/common';
import { LessonRequest, LessonRequestStatus } from '@prisma/client';
import { PrismaService } from '#prisma/prisma.service.js';
import { ILessonRepository } from './interface/lesson-repository.interface.js';
import { CreateLesson, PatchLesson } from './type/lesson.type.js';

@Injectable()
export class LessonRepository implements ILessonRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateLesson & { userId: string }): Promise<LessonRequest> {
    console.log('repo data', data);
    return this.prisma.lessonRequest.create({ data });
  }

  async findAll(): Promise<LessonRequest[]> {
    return this.prisma.lessonRequest.findMany();
  }

  async findOne(id: string): Promise<LessonRequest | null> {
    return this.prisma.lessonRequest.findUnique({ where: { id } });
  }

  async update(id: string, data: PatchLesson): Promise<LessonRequest | null> {
    return this.prisma.lessonRequest.update({ where: { id }, data });
  }

  async updateStatus(id: string, status: LessonRequestStatus): Promise<LessonRequest | null> {
    return this.prisma.lessonRequest.update({ where: { id }, data: { status } });
  }

  async delete(id: string): Promise<LessonRequest> {
    return this.prisma.lessonRequest.delete({ where: { id } });
  }
}
