import { Injectable } from '@nestjs/common';
import { DirectQuoteRequestStatus, LessonQuote, Prisma, QuoteStatus } from '@prisma/client';
import { PrismaService } from '#prisma/prisma.service.js';
import { QueryQuoteDto } from './dto/quote.dto.js';
import type { IQuoteRepository } from './interface/quote-repository.interface.js';
import type { CreateLessonQuote, LessonQuoteResponse, PatchLessonQuote } from './type/quote.type.js';

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

  async findQuotes(
    query: QueryQuoteDto,
  ): Promise<{ quotes: LessonQuoteResponse[]; totalCount: number; hasMore: boolean }> {
    const {
      page = 1,
      limit = 5,
      order = 'createdAt',
      sort = 'desc',
      status,
      trainerId,
      minPrice,
      maxPrice,
      lessonRequestId,
    } = query.toCamelCase();

    const orderMapping: Record<string, string> = {
      created_at: 'createdAt',
      updated_at: 'updatedAt',
      price: 'price',
    };

    const orderByField = orderMapping[order] || order;
    const orderBy: Record<string, string> = { [orderByField]: sort };

    const skip = (page - 1) * limit;
    const take = limit;

    const where: Prisma.LessonQuoteWhereInput = {
      ...(status && { status: { in: status } }),
      ...(trainerId && { trainerId }),
      ...(lessonRequestId && { lessonRequestId }),
      ...(minPrice || maxPrice ? { price: { gte: minPrice || undefined, lte: maxPrice || undefined } } : {}),
    };

    const [quotes, totalCount] = await Promise.all([
      this.lessonQuote.findMany({
        where,
        orderBy,
        skip,
        take,
        include: {
          lessonRequest: {
            include: {
              user: {
                select: {
                  id: true,
                  nickname: true,
                },
              },
            },
          },
          trainer: {
            select: {
              id: true,
              email: true,
              nickname: true,
            },
          },
        },
      }),
      this.lessonQuote.count({ where }),
    ]);

    const hasMore = totalCount > page * limit;

    return { quotes, totalCount, hasMore };
  }

  async count(where?: Record<string, any>): Promise<number> {
    return await this.lessonQuote.count({ where });
  }

  async findOne(id: string): Promise<LessonQuoteResponse | null> {
    return await this.lessonQuote.findUnique({
      where: { id },
      include: {
        lessonRequest: {
          include: {
            user: {
              select: {
                id: true,
                nickname: true,
              },
            },
          },
        },
        trainer: {
          select: {
            id: true,
            email: true,
            nickname: true,
          },
        },
      },
    });
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

  async updateStatusWithTx(
    tx: Prisma.TransactionClient,
    quoteId: string,
    status: QuoteStatus,
  ): Promise<LessonQuote> {
    return await tx.lessonQuote.update({
      where: { id: quoteId },
      data: { status },
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

  async findReviewableQuotes(userId: string, skip: number, take: number): Promise<LessonQuote[]> {
    return await this.lessonQuote.findMany({
      where: {
        status: 'ACCEPTED',
        lessonRequest: {
          userId: userId,
          status: 'COMPLETED',
        },
        Review: {
          none: {},
        },
      },
      skip,
      take,
      include: {
        lessonRequest: true,
        Review: true,
      },
    });
  }

  async countReviewableQuotes(userId: string): Promise<number> {
    return await this.lessonQuote.count({
      where: {
        status: 'ACCEPTED',
        lessonRequest: {
          userId: userId,
          status: 'COMPLETED',
        },
        Review: {
          none: {},
        },
      },
    });
  }

  async updateDirectQuoteStatus({
    lessonRequestId,
    trainerId,
    status,
  }: {
    lessonRequestId: string;
    trainerId: string;
    status: DirectQuoteRequestStatus;
  }): Promise<void> {
    await this.directQuoteRequest.updateMany({
      where: {
        lessonRequestId,
        trainerId,
      },
      data: {
        status,
      },
    });
  }
}
