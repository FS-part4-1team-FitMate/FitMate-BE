import { Injectable } from '@nestjs/common';
import { PrismaService } from '#prisma/prisma.service.js';
import { getTodayRange } from '#utils/date.util.js';
import { QueryNotificationDto } from './dto/notification.dto.js';
import type {
  CreateNotification,
  NotificationResponse,
  PatchNotification,
} from './type/notification.type.js';

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

  async findNotificationById(notificationId: number): Promise<NotificationResponse | null> {
    return await this.notification.findUnique({
      where: { id: notificationId },
    });
  }

  async updateNotification(notificationId: number, data: PatchNotification): Promise<NotificationResponse> {
    return await this.notification.update({
      where: { id: notificationId },
      data,
    });
  }

  async createNotification(data: CreateNotification): Promise<NotificationResponse> {
    return await this.notification.create({ data });
  }

  /**
   * 특정 유저가 오늘 날짜에 레슨시작 알림을 이미 받았는지 확인
   */
  async hasLessonStartNotification(userId: string, now: Date): Promise<boolean> {
    const { startOfDay, endOfDay } = getTodayRange(now);

    const exisingNotification = await this.notification.findFirst({
      where: {
        userId,
        type: 'LESSON_QUOTE',
        message: {
          contains: '시작됩니다',
        },
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    return !!exisingNotification;
  }
}
