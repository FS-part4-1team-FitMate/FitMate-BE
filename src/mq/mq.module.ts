import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheConfigModule } from '#cache/cache.config.module.js';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CacheConfigModule,
    BullModule.forRootAsync({
      imports: [CacheConfigModule],
      inject: ['BULL_REDIS'],
      useFactory: (redisOptions) => ({
        connection: redisOptions,
      }),
    }),
  ],
  exports: [BullModule],
})
export class MqModule {}
