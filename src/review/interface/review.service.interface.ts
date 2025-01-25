import { LessonType, Review } from '@prisma/client';
import { CreateReviewDto } from '../dto/review.dto';

export interface IReviewService {
  createReview(data: CreateReviewDto): Promise<Review>;
  getReviews(
    trainerId?: string,
    page?: number,
    limit?: number,
  ): Promise<{
    reviews: {
      id: string;
      createdAt: Date;
      rating: number;
      content: string;
      user: {
        nickname: string;
      };
    }[];
    totalCount: number;
  }>;
  getMyReviews(
    page?: number,
    limit?: number,
  ): Promise<{
    reviews: any[];
    totalCount: number;
  }>;
}
