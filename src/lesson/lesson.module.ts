import { forwardRef, Module } from '@nestjs/common';
import { PrismaService } from '#prisma/prisma.service.js';
import { UserModule } from '#user/user.module.js';
import { UserService } from '#user/user.service.js';
import { QuoteModule } from '#quote/quote.module.js';
import { LessonController } from './lesson.controller.js';
import { LessonRepository } from './lesson.repository.js';
import { LessonService } from './lesson.service.js';

@Module({
  imports: [forwardRef(() => QuoteModule), UserModule],
  controllers: [LessonController],
  providers: [LessonService, LessonRepository, UserService, PrismaService],
  exports: [LessonService],
})
export class LessonModule {}
