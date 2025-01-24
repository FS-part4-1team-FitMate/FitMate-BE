import { Controller, Post, Body, Param, UseGuards, Get, Query } from '@nestjs/common';
import { AccessTokenGuard } from '#auth/guard/access-token.guard.js';
import { CreateReviewDto, GetReviewsQueryDto } from './dto/review.dto.js';
import { ReviewService } from './review.service.js';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  async createReview(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewService.createReview(createReviewDto);
  }

  @Get()
  @UseGuards(AccessTokenGuard)
  async getReviews(@Query() query: GetReviewsQueryDto) {
    return this.reviewService.getReviews(query.trainer_id, query.page, query.limit);
  }
}
