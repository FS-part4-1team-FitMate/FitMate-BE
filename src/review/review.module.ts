import { Module } from '@nestjs/common';
import { PrismaService } from '#prisma/prisma.service.js';
import { ReviewController } from '#review/review.controller.js';
import { ReviewRepository } from '#review/review.repository.js';
import { ReviewService } from '#review/review.service.js';

@Module({
  controllers: [ReviewController],
  providers: [ReviewService, ReviewRepository, PrismaService],
  exports: [ReviewService],
})
export class ReviewModule {}
