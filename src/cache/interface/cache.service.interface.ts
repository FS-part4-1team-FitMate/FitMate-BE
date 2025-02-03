export interface ICacheService {
  // testRedisConnection(): Promise<void>;
  get(key: string): Promise<{ key: string; value: any | null }>;
  set(key: string, value: any, ttl?: number): Promise<{ key: string; value: any; ttl?: number }>;
  del(key: string): Promise<{ key: string; previousValue?: any; deleted: boolean }>;
}
