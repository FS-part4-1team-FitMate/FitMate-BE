import { forwardRef, Module } from '@nestjs/common';
import { PrismaService } from '#prisma/prisma.service.js';
import { AuthModule } from '#auth/auth.module.js';
import { LessonModule } from '#lesson/lesson.module.js';
import { QuoteController } from './quote.controller.js';
import { QuoteRepository } from './quote.repository.js';
import { QuoteService } from './quote.service.js';
@Module({
  imports: [forwardRef(() => LessonModule), AuthModule],
  controllers: [QuoteController],
  providers: [
    QuoteService,
    {
      provide: 'IQuoteService',
      useExisting: QuoteService,
    },
    QuoteRepository,
    PrismaService,
  ],
  exports: ['IQuoteService'],
})
export class QuoteModule {}
