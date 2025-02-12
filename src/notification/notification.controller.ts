import { Controller, Get, Param, Patch, Query, Sse, UseGuards } from '@nestjs/common';
import { map, Observable, tap } from 'rxjs';
import { AccessTokenGuard } from '#auth/guard/access-token.guard.js';
import { logger } from '#logger/winston-logger.js';
import { QueryNotificationDto } from './dto/notification.dto.js';
import { NotificationService } from './notification.service.js';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @UseGuards(AccessTokenGuard)
  async getNotifications(@Query() query: QueryNotificationDto) {
    return this.notificationService.getNotifications(query);
  }

  @Sse('sse')
  sse(@Query('user_id') userId: string): Observable<string> {
    return this.notificationService.getUserNotificationStream(userId).pipe(
      tap((data) => {
        logger.debug(`SSE 응답 데이터:\n ${JSON.stringify(data, null, 2)}`);
      }),
      map((data) => `${JSON.stringify(data)}\n\n`), //SSE 표준 형식으로 변환
    );
  }
  @Patch(':notificationId/read')
  @UseGuards(AccessTokenGuard)
  async readNotification(@Param('notificationId') notificationId: number) {
    return this.notificationService.toggleNotificaitonRead(notificationId);
  }
}
