import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import pkg from 'pg';
import { Subject } from 'rxjs';

const { Client } = pkg;

@Injectable()
export class NotificationService implements OnModuleInit, OnModuleDestroy {
  private pgClient: InstanceType<typeof Client>;
  private notificationStream = new Subject<any>();

  constructor() {
    this.pgClient = new Client({
      connectionString: process.env.DATABASE_URL,
    });
  }

  async onModuleInit() {
    await this.pgClient.connect();
    await this.listenForNotifications();
  }

  private async listenForNotifications() {
    this.pgClient.on('notification', (msg) => {
      if (!msg.payload) {
        console.warn('새 알림 수신: payload가 비어 있습니다.');
        return;
      }

      try {
        const parsedPayload = JSON.parse(msg.payload);
        console.warn('새 알림 수신:\n', JSON.stringify(parsedPayload, null, 2));

        // SSE로 알림 전달 (type, id 등 옵션 추가 가능)
        this.notificationStream.next({
          data: parsedPayload,
          type: 'notification',
        });
      } catch (error) {
        console.warn('새 알림 수신(JSON 파싱 에러):', error);
      }
    });

    // PostgreSQL NOTIFY 이벤트 수신
    await this.pgClient.query('LISTEN notification_channel');
  }

  getNotificationStream() {
    // 클라이언트에서 SSE로 알림을 구독할 수 있도록 제공
    return this.notificationStream.asObservable();
  }

  async onModuleDestroy() {
    await this.pgClient.end();
  }
}
