import { Module } from '@nestjs/common';
import { PrismaService } from '#prisma/prisma.service.js';
import { LessonModule } from '#lesson/lesson.module.js';
import { QuoteController } from './quote.controller.js';
import { QuoteRepository } from './quote.repository.js';
import { QuoteService } from './quote.service.js';

@Module({
  imports: [LessonModule],
  controllers: [QuoteController],
  providers: [QuoteService, QuoteRepository, PrismaService],
  exports: [QuoteService],
})
export class QuoteModule {}
