import { Injectable } from '@nestjs/common';
import { Review } from '@prisma/client';
import { PrismaService } from '#prisma/prisma.service.js';
import { CreateReviewDto } from './dto/review.dto.js';
import { IReviewRepository } from './interface/review.repository.interface.js';
import { MyReviewResponse } from './type/review.type.js';

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

  async getReviews(trainerId?: string, page = 1, limit = 10) {
    const whereCondition = trainerId
      ? {
          lessonQuote: {
            trainerId,
          },
        }
      : {};

    const reviews = await this.prisma.review.findMany({
      where: whereCondition,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        rating: true,
        content: true,
        createdAt: true,
        user: {
          select: {
            nickname: true,
          },
        },
      },
    });

    const totalCount = await this.prisma.review.count({
      where: whereCondition,
    });

    return { reviews, totalCount };
  }

  async getMyReviews(
    userId: string,
    page = 1,
    limit = 10,
  ): Promise<{ reviews: MyReviewResponse[]; totalCount: number }> {
    const reviews = await this.prisma.review.findMany({
      where: { userId },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        content: true,
        createdAt: true,
        lessonQuote: {
          select: {
            price: true,
            trainer: {
              select: {
                nickname: true,
                profile: {
                  select: {
                    profileImage: true,
                  },
                },
              },
            },
            lessonRequest: {
              select: {
                quoteEndDate: true,
                lessonType: true,
              },
            },
          },
        },
      },
    });

    const totalCount = await this.prisma.review.count({
      where: { userId },
    });

    return {
      reviews,
      totalCount,
    };
  }

  async getReviewRatingStats(trainerId: string): Promise<{ rating: number; count: number }[]> {
    const ratings = await this.prisma.review.groupBy({
      by: ['rating'],
      where: {
        lessonQuote: {
          trainerId,
        },
      },
      _count: {
        rating: true,
      },
      orderBy: {
        rating: 'asc',
      },
    });

    const defaultRatings = [1, 2, 3, 4, 5].map((rating) => ({
      rating,
      count: 0,
    }));

    ratings.forEach((r) => {
      const index = defaultRatings.findIndex((d) => d.rating === r.rating);
      if (index !== -1) {
        defaultRatings[index].count = r._count.rating;
      }
    });

    return defaultRatings;
  }

  async isTrainerExists(trainerId: string): Promise<boolean> {
    const trainer = await this.prisma.user.findUnique({
      where: { id: trainerId, role: 'TRAINER' }, // 역할이 'TRAINER'인지 확인
    });
    return !!trainer;
  }
}
