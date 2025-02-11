import { forwardRef, Module } from '@nestjs/common';
import { PrismaService } from '#prisma/prisma.service.js';
import { UserModule } from '#user/user.module.js';
import { UserService } from '#user/user.service.js';
import { QuoteModule } from '#quote/quote.module.js';
import { NotificationModule } from '#notification/notification.module.js';
import { NotificationService } from '#notification/notification.service.js';
import { LessonSchedulerService } from './lesson-scheduler.service.js';
import { LessonController } from './lesson.controller.js';
import { LessonRepository } from './lesson.repository.js';
import { LessonService } from './lesson.service.js';

@Module({
  imports: [forwardRef(() => QuoteModule), UserModule, NotificationModule],
  controllers: [LessonController],
  providers: [LessonService, LessonRepository, UserService, PrismaService, LessonSchedulerService],
  exports: [LessonService],
})
export class LessonModule {}
