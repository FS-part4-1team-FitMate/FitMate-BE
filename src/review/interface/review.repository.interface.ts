import { Review } from '@prisma/client';
import { CreateReviewDto } from '../dto/review.dto';

export interface IReviewRepository {
  create(data: CreateReviewDto, userId: string): Promise<Review>;
  findByLessonQuoteId(lessonQuoteId: string): Promise<Review | null>;
}
