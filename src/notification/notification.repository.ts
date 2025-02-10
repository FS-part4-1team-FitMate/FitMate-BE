import { Injectable } from '@nestjs/common';
import { PrismaService } from '#prisma/prisma.service.js';
import { QueryNotificationDto } from './dto/notification.dto.js';
import type { NotificationResponse } from './type/notification.type.js';

@Injectable()
export class NotificationRepository {
  private readonly notification;
  constructor(private readonly prisma: PrismaService) {
    this.notification = this.prisma.notification;
  }

  private orderMapping: Record<string, string> = {
    created_at: 'createdAt',
    updated_at: 'updatedAt',
  };

  async findNotifications(
    query: QueryNotificationDto,
    userId: string,
  ): Promise<{ notifications: NotificationResponse[]; totalCount: number; hasMore: boolean }> {
    const { page = 1, limit = 5, order = 'createdAt', sort = 'desc' } = query;

    const orderByField = this.orderMapping[order];

    const skip = (page - 1) * limit;
    const notifications = await this.notification.findMany({
      where: { userId },
      orderBy: { [orderByField]: sort },
      skip,
      take: limit,
    });

    const totalCount = await this.notification.count({ where: { userId } });
    const hasMore = totalCount > page * limit;

    return { notifications, totalCount, hasMore };
  }
}
