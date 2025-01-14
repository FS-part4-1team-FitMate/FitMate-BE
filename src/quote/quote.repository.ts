import { Injectable } from '@nestjs/common';
import { LessonQuote, QuoteStatus } from '@prisma/client';
import { PrismaService } from '#prisma/prisma.service.js';
import { IQuoteRepository } from './interface/quote-repository.interface.js';
import { CreateLessonQuote, PatchLessonQuote } from './type/quote.type.js';

@Injectable()
export class QuoteRepository implements IQuoteRepository {
  private readonly lessonQuote;

  constructor(private readonly prisma: PrismaService) {
    this.lessonQuote = prisma.lessonQuote;
  }

  async create(data: CreateLessonQuote): Promise<LessonQuote> {
    return await this.lessonQuote.create({ data });
  }

  async findAll(): Promise<LessonQuote[]> {
    return await this.lessonQuote.findMany();
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
}
