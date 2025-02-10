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
// interface NotificationPayload {
//   id: number;
//   userId: string;
//   type: string;
//   message: string;
//   createdAt: string;
//   updatedAt: string;
// }
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
}
