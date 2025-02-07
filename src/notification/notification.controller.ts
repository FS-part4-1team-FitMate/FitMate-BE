import { Controller, Query, Sse } from '@nestjs/common';
import { map, Observable, tap } from 'rxjs';
import { logger } from '#logger/winston-logger.js';
import { NotificationService } from './notification.service.js';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Sse('sse')
  sse(@Query('user_id') userId: string): Observable<string> {
    return this.notificationService.getUserNotificationStream(userId).pipe(
      tap((data) => {
        logger.debug(`SSE 응답 데이터:\n ${JSON.stringify(data, null, 2)}`);
      }),
      map((data) => `${JSON.stringify(data)}\n\n`), //SSE 표준 형식으로 변환
    );
  }
}
