import { FactoryProvider } from '@nestjs/common';
import Redis from 'ioredis';

export const CACHE_CLIENT = Symbol('CACHE_CLIENT');

export const cacheClient: FactoryProvider = {
  provide: CACHE_CLIENT,
  useFactory: async () => {
    const client = new Redis({
      host: 'localhost',
      port: 6379,
      password: 'redis-password',
    });

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
