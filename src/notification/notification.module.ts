import { Module } from '@nestjs/common';
import { PrismaService } from '#prisma/prisma.service.js';
import { NotificationController } from './notification.controller.js';
import { NotificationRepository } from './notification.repository.js';
import { NotificationService } from './notification.service.js';

@Module({
  controllers: [NotificationController],
  providers: [NotificationService, NotificationRepository, PrismaService],
  exports: [NotificationService],
})
export class NotificationModule {}
