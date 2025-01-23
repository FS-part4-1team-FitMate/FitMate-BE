import { Injectable } from '@nestjs/common';
import { Review } from '@prisma/client';
import { PrismaService } from '#prisma/prisma.service.js';
import { CreateReviewDto } from './dto/review.dto.js';
import { IReviewRepository } from './interface/review.repository.interface.js';

@Injectable()
export class ReviewRepository implements IReviewRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateReviewDto, userId: string): Promise<Review> {
    return await this.prisma.review.create({
      data: {
        userId,
        lessonQuoteId: data.lessonQuoteId,
        rating: data.rating,
        content: data.content,
      },
    });
  }

  async findByLessonQuoteId(lessonQuoteId: string): Promise<Review | null> {
    return await this.prisma.review.findFirst({
      where: { lessonQuoteId },
    });
  }
}
