import { Module } from '@nestjs/common';
import { cacheClient } from '#cache/cache.client.js';
import { CacheConfigModule } from '#cache/cache.config.module.js';
import { CacheService } from '#cache/cache.service.js';

@Module({
  imports: [CacheConfigModule],
  providers: [cacheClient, CacheService],
  exports: [CacheService],
})
export class CacheModule {}
