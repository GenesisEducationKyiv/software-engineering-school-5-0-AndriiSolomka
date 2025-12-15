import { FactoryProvider } from '@nestjs/common';
import { Redis } from 'ioredis';
import { RedisConfig } from 'libs/config/redis.config';

export const REDIS_CLIENT = Symbol('RedisClient');

export const redisClientFactory: FactoryProvider<Redis> = {
  provide: REDIS_CLIENT,
  useFactory: (config: RedisConfig) => {
    try {
      const redis = new Redis({
        host: config.host,
        port: config.port,
      });

      redis.on('error', () => {
        process.exit(1);
      });

      return redis;
    } catch {
      process.exit(1);
    }
  },
  inject: [RedisConfig],
};
