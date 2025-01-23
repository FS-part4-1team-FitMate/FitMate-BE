import { Review } from '@prisma/client';
import { CreateReviewDto } from '../dto/review.dto';

export interface IReviewService {
  createReview(data: CreateReviewDto): Promise<Review>;
}
