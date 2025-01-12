import { Module } from '@nestjs/common';
import { PrismaService } from '#prisma/prisma.service.js';
import { AuthModule } from '#auth/auth.module.js'; // AuthModule 추가
import { TrainerController } from '#trainer/trainer.controller.js';
import { TrainerRepository } from '#trainer/trainer.repository.js';
import { TrainerService } from '#trainer/trainer.service.js';

@Module({
  imports: [AuthModule], // AuthModule 추가
  controllers: [TrainerController],
  providers: [TrainerService, TrainerRepository, PrismaService],
})
export class TrainerModule {}
