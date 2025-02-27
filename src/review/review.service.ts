import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LessonRequestStatus, Review } from '@prisma/client';
import { AlsStore } from '#common/als/store-validator.js';
import AuthExceptionMessage from '#exception/auth-exception-message.js';
import ExceptionMessages from '#exception/exception-message.js';
import QuoteExceptionMessage from '#exception/quote-exception-message.js';
import ReviewExceptionMessage from '#exception/review-exception-message.js';
import { UserService } from '#user/user.service.js';
import { LessonService } from '#lesson/lesson.service.js';
import type { IQuoteService } from '#quote/interface/quote-service.interface.js';
import { CreateReviewDto, GetReviewsQueryDto } from './dto/review.dto.js';
import { IReviewService } from './interface/review.service.interface.js';
import { ReviewRepository } from './review.repository.js';

@Injectable()
export class ReviewService implements IReviewService {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly lessonService: LessonService,
    @Inject('IQuoteService')
    private readonly quoteService: IQuoteService,
    private readonly alsStore: AlsStore,
    private readonly userService: UserService,
  ) {}
  async createReview(data: CreateReviewDto): Promise<Review> {
    const { userId } = this.alsStore.getStore();
    if (!userId) {
      throw new UnauthorizedException(AuthExceptionMessage.UNAUTHORIZED);
    }

    // 견적 존재 여부 검증
    const quote = await this.quoteService.getLessonQuoteById(data.lessonQuoteId);
    if (!quote) {
      throw new NotFoundException(QuoteExceptionMessage.QUOTE_NOT_FOUND);
    }

    // 레슨 요청의 상태 확인
    const lesson = await this.lessonService.getLessonById(quote.lessonRequestId);
    if (lesson.status !== LessonRequestStatus.COMPLETED) {
      throw new BadRequestException(ReviewExceptionMessage.LESSON_NOT_COMPLETED);
    }

    // 로그인한 사용자가 해당 레슨을 요청한 사용자와 일치하는지 검증
    if (lesson.userId !== userId) {
      throw new ForbiddenException(ExceptionMessages.FORBIDDEN);
    }

    // 이미 리뷰가 존재하는지 확인
    const existingReview = await this.reviewRepository.findByLessonQuoteId(data.lessonQuoteId);
    if (existingReview) {
      throw new BadRequestException(ReviewExceptionMessage.ALREADY_REVIEWED);
    }

    const review = await this.reviewRepository.create(data, userId);

    await this.reviewRepository.updateTrainerRating(quote.trainerId);

    return review;
  }

  async getReviews(trainerId?: string, page = 1, limit = 10) {
    return this.reviewRepository.getReviews(trainerId, page, limit);
  }

  async getMyReviews(page = 1, limit = 10) {
    const { userId } = this.alsStore.getStore();
    if (!userId) {
      throw new UnauthorizedException(AuthExceptionMessage.UNAUTHORIZED);
    }

    return this.reviewRepository.getMyReviews(userId, page, limit);
  }

  async getReviewRatingStats(trainerId: string) {
    await this.userService.findUserById(trainerId);

    return this.reviewRepository.getReviewRatingStats(trainerId);
  }
}
