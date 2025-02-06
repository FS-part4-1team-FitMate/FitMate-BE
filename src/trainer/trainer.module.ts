import { Module } from '@nestjs/common';
import { PrismaService } from '#prisma/prisma.service.js';
import { AlsModule } from '#common/als/als.module.js';
import { TrainerController } from '#trainer/trainer.controller.js';
import { TrainerRepository } from '#trainer/trainer.repository.js';
import { TrainerService } from '#trainer/trainer.service.js';

@Module({
  imports: [AlsModule], // AuthModule 추가
  controllers: [TrainerController],
  providers: [TrainerService, TrainerRepository, PrismaService],
})
export class TrainerModule {}
