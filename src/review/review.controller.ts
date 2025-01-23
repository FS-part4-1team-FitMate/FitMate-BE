import { Controller, Post, Body, Param, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from '#auth/guard/access-token.guard.js';
import { CreateReviewDto } from './dto/review.dto.js';
import { ReviewService } from './review.service.js';

@Controller('quotes/reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  async createReview(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewService.createReview(createReviewDto);
  }
}
