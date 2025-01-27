import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { CACHE_CLIENT } from '#cache/cache.client.js';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_CLIENT) private readonly redisClient: Redis) {}

  async testRedisConnection(): Promise<void> {
    try {
      await this.redisClient.set('test-key', 'Hello, Redis!');
      const value = await this.redisClient.get('test-key');
      console.log(`Redis Test Passed: test-key = ${value}`);
    } catch (err) {
      console.error('Redis Test Failed:', err);
    }
  }

  async get(key: string): Promise<{ key: string; value: any | null }> {
    const value = await this.redisClient.get(key);
    if (value) {
      try {
        return { key, value: JSON.parse(value) };
      } catch (e) {
        return { key, value };
      }
    }

    return { key, value: null };
  }

  async set(key: string, value: any, ttl: number): Promise<{ key: string; value: any; ttl?: number }> {
    if (ttl) {
      await this.redisClient.set(key, JSON.stringify(value), 'EX', ttl);
    } else {
      await this.redisClient.set(key, JSON.stringify(value));
    }

    return { key, value, ttl };
  }

  async del(key: string): Promise<{ key: string; previousValue?: any; deleted: boolean }> {
    const previousValue = await this.redisClient.get(key);
    if (!previousValue) {
      return { key, deleted: false };
    }

    await this.redisClient.del(key);

    return { key, previousValue: JSON.parse(previousValue), deleted: true };
  }
}
