import { Injectable } from '@nestjs/common';
import { LessonQuote, Prisma, QuoteStatus } from '@prisma/client';
import { PrismaService } from '#prisma/prisma.service.js';
import { IQuoteRepository } from './interface/quote-repository.interface.js';
import { CreateLessonQuote, PatchLessonQuote } from './type/quote.type.js';

@Injectable()
export class QuoteRepository implements IQuoteRepository {
  private readonly lessonQuote;
  private readonly directQuoteRequest;

  constructor(private readonly prisma: PrismaService) {
    this.lessonQuote = prisma.lessonQuote;
    this.directQuoteRequest = prisma.directQuoteRequest;
  }

  async create(data: CreateLessonQuote): Promise<LessonQuote> {
    return await this.lessonQuote.create({ data });
  }

  async findAll(
    where?: Record<string, any>,
    orderBy?: Record<string, string>,
    skip?: number,
    take?: number,
    select?: Prisma.LessonQuoteSelect,
  ): Promise<LessonQuote[]> {
    return await this.prisma.lessonQuote.findMany({
      where,
      orderBy,
      skip,
      take,
      select,
    });
  }

  async count(where?: Record<string, any>): Promise<number> {
    return await this.prisma.lessonQuote.count({ where });
  }

  async findOne(id: string): Promise<LessonQuote | null> {
    return await this.lessonQuote.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: PatchLessonQuote): Promise<LessonQuote | null> {
    return await this.lessonQuote.update({ where: { id }, data });
  }

  async updateStatus(
    id: string,
    status: QuoteStatus,
    rejectionReason?: string | null,
  ): Promise<LessonQuote | null> {
    return await this.lessonQuote.update({
      where: { id },
      data: { status, rejectionReason },
    });
  }

  async findTrainerQuoteForLesson(lessonRequestId: string, trainerId: string): Promise<LessonQuote | null> {
    return await this.lessonQuote.findFirst({
      where: { lessonRequestId, trainerId },
    });
  }

  async findDirectQuoteRequestTrainers(lessonRequestId: string): Promise<string[]> {
    const trainers = await this.directQuoteRequest.findMany({
      where: { lessonRequestId },
      select: { trainerId: true },
    });
    return trainers.map((t) => t.trainerId);
  }
}
