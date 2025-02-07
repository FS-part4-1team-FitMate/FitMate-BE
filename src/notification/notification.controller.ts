import { Controller, Sse } from '@nestjs/common';
import { Observable } from 'rxjs';
import { NotificationService } from './notification.service.js';

export interface MessageEvent {
  data: string | object;
  id?: string;
  type?: string;
  retry?: number;
}

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Sse('sse')
  sse(): Observable<MessageEvent> {
    return this.notificationService.getNotificationStream();
  }
}
