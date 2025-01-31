import { Review } from '@prisma/client';
import { MyReviewResponse } from '#review/type/review.type.js';
import { CreateReviewDto } from '../dto/review.dto';

export interface IReviewRepository {
  create(data: CreateReviewDto, userId: string): Promise<Review>;
  findByLessonQuoteId(lessonQuoteId: string): Promise<Review | null>;
  getReviews(
    trainerId?: string,
    page?: number,
    limit?: number,
  ): Promise<{
    reviews: {
      id: string;
      rating: number;
      content: string;
      createdAt: Date;
      user: {
        nickname: string;
      };
    }[];
    totalCount: number;
  }>;

  getMyReviews(
    userId: string,
    page?: number,
    limit?: number,
  ): Promise<{
    reviews: MyReviewResponse[];
    totalCount: number;
  }>;

  getReviewRatingStats(trainerId: string): Promise<{ rating: number; count: number }[]>;
  isTrainerExists(trainerId: string): Promise<boolean>;
}
