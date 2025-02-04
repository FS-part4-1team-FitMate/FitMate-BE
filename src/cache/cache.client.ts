import { FactoryProvider } from '@nestjs/common';
import Redis from 'ioredis';

export const CACHE_CLIENT = Symbol('CACHE_CLIENT');

export const cacheClient: FactoryProvider = {
  provide: CACHE_CLIENT,
  inject: ['CACHE_REDIS'],
  useFactory: async (redisOptions) => {
    const client = new Redis(redisOptions);

    // 추후 삭제
    client.on('connect', () => {
      console.log('Connected to Redis!');
    });

    client.on('error', (err) => {
      console.error('Redis error:', err);
    });

    return client;
  },
};
