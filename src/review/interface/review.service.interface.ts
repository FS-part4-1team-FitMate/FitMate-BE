import { Review } from '@prisma/client';
import { MyReviewResponse } from '#review/type/review.type.js';
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
    reviews: MyReviewResponse[];
    totalCount: number;
  }>;

  getReviewRatingStats(trainerId: string): Promise<{ rating: number; count: number }[]>;
}
