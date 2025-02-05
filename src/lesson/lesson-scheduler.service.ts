import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { logger } from '#logger/winston-logger.js';
import { LessonRepository } from './lesson.repository.js';

@Injectable()
export class LessonSchedulerService {
  constructor(private readonly lessonRepository: LessonRepository) {}

  async onModuleInit() {
    logger.info('NestJS 시작시 handleCron() 실행');
    await this.handleCron();
  }

  @Cron('0 0 * * *', { timeZone: 'Asia/Seoul' }) // 매일 자정에 한번 실행
  async handleCron() {
    const now = new Date();
    const result = await this.lessonRepository.updateExpiredLesson(now);
    logger.info(`Expired lessons: ${result.count}`);
  }
}
