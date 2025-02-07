import { BadRequestException, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import pkg from 'pg';
import { Observable, Subject } from 'rxjs';
import NotificationExpeptionMessage from '#exception/notification-exception-message.js';
import { logger } from '#logger/winston-logger.js';

const { Client } = pkg;
interface NotificationPayload {
  id: number;
  userId: string;
  type: string;
  message: string;
  createdAt: string;
  updatedAt?: string;
}
@Injectable()
export class NotificationService implements OnModuleInit, OnModuleDestroy {
  private pgClient: InstanceType<typeof Client>;

  // 유저별로 알림을 보내기 위해, userId -> Subject 맵핑
  private userNotificationStreams: Map<string, Subject<NotificationPayload>> = new Map();

  constructor() {
    this.pgClient = new Client({
      connectionString: process.env.DATABASE_URL,
    });
  }

  async onModuleInit() {
    await this.pgClient.connect();
    await this.listenForNotifications();
  }

  // PostgreSQL NOTIFY 이벤트를 수신하여 알림 처리
  private async listenForNotifications() {
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
}
