import { Controller, Post, Body, Param, UseGuards, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AccessTokenGuard } from '#auth/guard/access-token.guard.js';
import {
  CreateReviewDto,
  GetReviewsQueryDto,
  GetMyReviewsQueryDto,
  GetReviewListResponseDto,
  ReviewMeResponseDto,
} from './dto/review.dto.js';
import { ReviewService } from './review.service.js';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  @ApiOperation({
    summary: '리뷰 생성',
    description: '리뷰를 생성합니다.',
  })
  async createReview(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewService.createReview(createReviewDto);
  }

  @Get()
  @UseGuards(AccessTokenGuard)
  @ApiOperation({
    summary: '리뷰 목록 조회',
    description: '리뷰 목록을 조회합니다.',
  })
  @ApiResponse({ status: 200, description: '리뷰 목록 조회 성공', type: GetReviewListResponseDto })
  async getReviews(@Query() query: GetReviewsQueryDto) {
    return this.reviewService.getReviews(query.trainer_id, query.page, query.limit);
  }

  @Get('me')
  @UseGuards(AccessTokenGuard)
  @ApiOperation({
    summary: '나의  리뷰 목록 조회',
    description: '나의 리뷰 목록을 조회합니다.',
  })
  @ApiResponse({ status: 200, description: '리뷰 목록 조회 성공', type: ReviewMeResponseDto })
  async getMyReviews(@Query() query: GetMyReviewsQueryDto) {
    return this.reviewService.getMyReviews(query.page, query.limit);
  }

  @Get('rating-stats/:trainerId')
  @UseGuards(AccessTokenGuard)
  async getReviewRatingStats(@Param('trainerId') trainerId: string) {
    return this.reviewService.getReviewRatingStats(trainerId);
  }
}
