import { Notification } from '@prisma/client';
import { QueryNotificationDto } from '../dto/notification.dto.js';

export interface INotificationRepository {
  findNotifications(
    query: QueryNotificationDto,
    userId: string,
  ): Promise<{ notifications: Notification[]; totalCount: number; hasMore: boolean }>;
}
