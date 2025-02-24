import { BadRequestException, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Notification } from '@prisma/client';
import pkg from 'pg';
import { Observable, Subject } from 'rxjs';
import { AlsStore } from '#common/als/store-validator.js';
import NotificationExpeptionMessage from '#exception/notification-exception-message.js';
import { logger } from '#logger/winston-logger.js';
import { QueryNotificationDto } from './dto/notification.dto.js';
import { INotificationService } from './interface/notification-service.interface.js';
import { NotificationRepository } from './notification.repository.js';
import type { NotificationPayload, NotificationResponse } from './type/notification.type.js';

const { Client } = pkg;

@Injectable()
export class NotificationService implements OnModuleInit, OnModuleDestroy, INotificationService {
  private pgClient: InstanceType<typeof Client>;
  // 유저별로 알림을 보내기 위해, userId -> Subject 맵핑
  private userNotificationStreams: Map<string, Subject<NotificationPayload>> = new Map();

  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly alsStore: AlsStore,
  ) {
    this.pgClient = new Client({
      connectionString: process.env.DATABASE_URL,
    });
  }

  /*************************************************************************************
   * SSE(Server-Sent Events)를 사용하여 클라이언트에 알림을 전달하는 서비스
   * ***********************************************************************************
   */
  async onModuleInit() {
    await this.pgClient.connect();
    await this.listenForNotifications();
  }

  // PostgreSQL NOTIFY 이벤트를 수신하여 알림 처리
  public async listenForNotifications() {
    this.pgClient.on('notification', (msg) => {
      if (!msg.payload) {
        logger.debug('새 알림 수신: payload가 비어 있습니다.');
        return;
      }

      try {
        const parsedPayload = JSON.parse(msg.payload);
        logger.debug(`새 알림 수신:\n ${JSON.stringify(parsedPayload, null, 2)}`);

        const { userId, type } = parsedPayload;
        if (!userId) {
          logger.debug('새 알림 수신: userId가 없습니다.');
          return;
        }

        if (!type) {
          logger.debug('새 알림 수신: type이 없습니다.');
          return;
        }

        // 유저별 Subject가 존재한다면 알림 전송
        const userStream = this.userNotificationStreams.get(userId);
        if (userStream) {
          userStream.next(parsedPayload);
        } else {
          logger.debug(`userId=${userId}에 대한 활성화된 스트림이 없습니다.`);
        }
      } catch (error) {
        logger.error('알림 처리 중 JSON 파싱 오류:', error);
      }
    });

    // PostgreSQL NOTIFY 이벤트 수신
    await this.pgClient.query('LISTEN notification_channel');
  }

  // userId 별로 알림을 구독할 수 있도록 Observable을 제공
  getUserNotificationStream(userId: string): Observable<any> {
    if (!userId) {
      throw new BadRequestException(NotificationExpeptionMessage.MISSING_USER_ID);
    }

    if (!this.userNotificationStreams.has(userId)) {
      const newStream = new Subject<NotificationPayload>();
      this.userNotificationStreams.set(userId, newStream);
    }

    return this.userNotificationStreams.get(userId)!.asObservable();
  }

  async onModuleDestroy(): Promise<void> {
    for (const [userId, subject] of this.userNotificationStreams.entries()) {
      subject.complete(); // 스트림 종료
      this.userNotificationStreams.delete(userId);
    }

    await this.pgClient.end();
  }

  /*************************************************************************************
   * 알림 목록 조회
   * ***********************************************************************************
   */
  async getNotifications(query: QueryNotificationDto): Promise<{
    list: NotificationResponse[];
    totalCount: number;
    hasMore: boolean;
  }> {
    const { userId } = this.alsStore.getStore();
    const { notifications, totalCount, hasMore } = await this.notificationRepository.findNotifications(
      query,
      userId,
    );
    return {
      list: notifications,
      totalCount,
      hasMore,
    };
  }

  /*************************************************************************************
   * 알림 읽음 처리
   * ***********************************************************************************
   */
  async toggleNotificaitonRead(notificationId: number): Promise<NotificationResponse> {
    const { userId } = this.alsStore.getStore();

    const notification = await this.notificationRepository.findNotificationById(notificationId);
    if (!notification) {
      throw new BadRequestException(NotificationExpeptionMessage.NOTIFICATION_NOT_FOUND);
    }

    if (notification.userId != userId) {
      throw new BadRequestException(NotificationExpeptionMessage.NOTIFICATION_NOT_MATCHED_USER);
    }

    return await this.notificationRepository.updateNotification(notificationId, {
      isRead: !notification.isRead,
    });
  }

  /*************************************************************************************
   * 레슨 시작 알림 생성
   * ***********************************************************************************
   */
  async createLessonStartNotification(
    userId: string,
    nickname: string,
    lessonSubType: string,
    now: Date,
  ): Promise<NotificationResponse | null> {
    const alreadyNotified = await this.notificationRepository.hasLessonStartNotification(userId, now);
    if (alreadyNotified) {
      logger.debug(`이미 레슨 시작 알림을 받은 유저: ${nickname}`);
      return null;
    }
    // 레슨 시작 알림 생성
    const notification = await this.notificationRepository.createNotification({
      userId,
      type: 'LESSON_QUOTE',
      message: `오늘 ${nickname}님의 레슨(${lessonSubType})이 시작됩니다!`,
    });
    return notification;
  }

  /*************************************************************************************
   * 채팅방 생성 알림
   * ***********************************************************************************
   */
  async createChatNotification(userId: string, message: string): Promise<NotificationResponse> {
    const notification = await this.notificationRepository.createNotification({
      userId,
      type: 'CHAT_MESSAGE',
      message,
    });
    return notification;
  }
}
