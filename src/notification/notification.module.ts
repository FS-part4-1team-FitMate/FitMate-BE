import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller.js';
import { NotificationRepository } from './notification.repository.js';
import { NotificationService } from './notification.service.js';
import { PrismaService } from '#prisma/prisma.service.js';

@Module({
  controllers: [NotificationController],
  providers: [NotificationService, NotificationRepository, PrismaService],
})
export class NotificationModule {}
