import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Review } from '@prisma/client';
import { AlsStore } from '#common/als/store-validator.js';
import AuthExceptionMessage from '#exception/auth-exception-message.js';
import ReviewExceptionMessage from '#exception/review-exception-message.js';
import { CreateReviewDto } from './dto/review.dto.js';
import { IReviewService } from './interface/review.service.interface.js';
import { ReviewRepository } from './review.repository.js';

@Injectable()
export class ReviewService implements IReviewService {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly alsStore: AlsStore,
  ) {}
  async createReview(data: CreateReviewDto): Promise<Review> {
    const { userId } = this.alsStore.getStore();
    if (!userId) {
      throw new UnauthorizedException(AuthExceptionMessage.UNAUTHORIZED);
    }

    // 견적 존재 여부 검증 (LessonQuote가 실제 존재하는지 확인)
    const existingQuote = await this.reviewRepository.findLessonQuoteById(data.lessonQuoteId);
    if (!existingQuote) {
      throw new NotFoundException('해당 견적을 찾을 수 없습니다.');
    }

    // 레슨 요청의 상태 확인
    const lessonStatus = await this.reviewRepository.findLessonRequestStatusByQuoteId(data.lessonQuoteId);
    if (lessonStatus !== 'COMPLETED') {
      throw new BadRequestException(ReviewExceptionMessage.LESSON_REQUEST_NOT_COMPLETED);
    }

    // 이미 리뷰가 존재하는지 확인
    const existingReview = await this.reviewRepository.findByLessonQuoteId(data.lessonQuoteId);
    if (existingReview) {
      throw new BadRequestException(ReviewExceptionMessage.ALREADY_REVIEWED);
    }

    return await this.reviewRepository.create(data, userId);
  }
}
