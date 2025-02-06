import { Module } from '@nestjs/common';
import { PrismaService } from '#prisma/prisma.service.js';
import { UserRepository } from '#user/user.repository.js';
import { UserService } from '#user/user.service.js';
import { LessonModule } from '#lesson/lesson.module.js';
import { QuoteModule } from '#quote/quote.module.js';
import { ReviewController } from '#review/review.controller.js';
import { ReviewRepository } from '#review/review.repository.js';
import { ReviewService } from '#review/review.service.js';

@Module({
  imports: [LessonModule, QuoteModule],
  controllers: [ReviewController],
  providers: [ReviewService, ReviewRepository, PrismaService, UserService, UserRepository],
  exports: [ReviewService],
})
export class ReviewModule {}
