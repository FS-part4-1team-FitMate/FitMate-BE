import { Module } from '@nestjs/common';
import { PrismaService } from '#prisma/prisma.service.js';
import { AlsModule } from '#common/als/als.module.js';
import { TrainerController } from '#trainer/trainer.controller.js';
import { TrainerRepository } from '#trainer/trainer.repository.js';
import { TrainerService } from '#trainer/trainer.service.js';
import { S3Module } from '#s3/s3.module.js';
import { S3Service } from '#s3/s3.service.js';

@Module({
  imports: [AlsModule, S3Module],
  controllers: [TrainerController],
  providers: [TrainerService, TrainerRepository, PrismaService, S3Service],
})
export class TrainerModule {}
