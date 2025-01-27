import { Module } from '@nestjs/common';
import { cacheClient } from '#cache/cache.client.js';
import { CacheService } from '#cache/cache.service.js';

@Module({
  providers: [cacheClient, CacheService],
  exports: [CacheService],
})
export class CacheModule {}
