import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { NotificationService } from '#notification/notification.service.js';
import { getLessonSubTypeKr } from '#utils/lesson.util.js';
import { logger } from '#logger/winston-logger.js';
import type { ILessonSchedulerService } from './interface/lesson-scheduler-service.interface.js';
import { LessonRepository } from './lesson.repository.js';

@Injectable()
export class LessonSchedulerService implements ILessonSchedulerService {
  constructor(
    private readonly lessonRepository: LessonRepository,
    private readonly notificationService: NotificationService,
  ) {}

  async onModuleInit() {
    logger.info('NestJS 시작시 handleCron() 실행');
    await this.handleCron();
  }

  @Cron('0 0 * * *', { timeZone: 'Asia/Seoul' }) // 매일 자정에 한번 실행
  async handleCron() {
    const now = new Date();

    // 만료된 레슨 처리
    const expiredLessons = await this.lessonRepository.updateExpiredLesson(now);
    logger.info(`Expired lessons: ${expiredLessons.count}`);

    // 완료된 레슨 처리
    const completedLessons = await this.lessonRepository.updateCompletedLesson(now);
    logger.info(`Completed lessons: ${completedLessons.count}`);

    // 오늘 시작하는 레슨 알림 처리
    const startingLessons = await this.lessonRepository.findLessonsStartingToday(now);
    logger.info(`Starting lessons: ${startingLessons.length}`);

    for (const lesson of startingLessons) {
      const lessonSubTypeKr = getLessonSubTypeKr(lesson.lessonSubType);

      const userNotification = await this.notificationService.createLessonStartNotification(
        lesson.userId,
        lesson.nickname,
        lessonSubTypeKr,
        now,
      );
      logger.debug(`레슨 시작 알림 생성됨 (레슨요청 유저): \n ${JSON.stringify(userNotification, null, 2)}`);
      if (lesson.trainerId) {
        const trainerNotification = await this.notificationService.createLessonStartNotification(
          lesson.trainerId,
          lesson.nickname,
          lessonSubTypeKr,
          now,
        );
        logger.debug(`레슨 시작 알림 생성됨 (트레이너): \n ${JSON.stringify(trainerNotification, null, 2)}`);
      }
    }
  }
}
