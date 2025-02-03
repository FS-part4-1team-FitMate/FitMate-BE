import { forwardRef, Module } from '@nestjs/common';
import { PrismaService } from '#prisma/prisma.service.js';
import { UserRepository } from '#user/user.repository.js';
import { QuoteModule } from '#quote/quote.module.js';
import { LessonSchedulerService } from './lesson-scheduler.service.js';
import { LessonController } from './lesson.controller.js';
import { LessonRepository } from './lesson.repository.js';
import { LessonService } from './lesson.service.js';

@Module({
  imports: [forwardRef(() => QuoteModule)],
  controllers: [LessonController],
  providers: [LessonService, LessonRepository, UserRepository, PrismaService, LessonSchedulerService],
  exports: [LessonService, LessonRepository],
})
export class LessonModule {}
