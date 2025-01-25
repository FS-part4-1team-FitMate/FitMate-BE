import { LessonType, Review } from '@prisma/client';
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
    reviews: any[];
    totalCount: number;
  }>;
}
