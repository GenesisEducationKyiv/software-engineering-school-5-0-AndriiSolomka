import { FactoryProvider } from '@nestjs/common';
import { Redis } from 'ioredis';
import { LoggerService } from 'libs/infrastructure/logger/logger.service';
import { RedisConfig } from 'src/libs/config/redis.config';

export const REDIS_CLIENT = Symbol('RedisClient');

export const redisClientFactory: FactoryProvider<Redis> = {
  provide: REDIS_CLIENT,
  useFactory: (config: RedisConfig, logger: LoggerService) => {
    try {
      const redis = new Redis({
        host: config.host,
        port: config.port,
      });

      redis.on('error', (e) => {
        logger.error(`Redis connection failed: ${e}`);
        process.exit(1);
      });

      return redis;
    } catch (error) {
      logger.error('Failed to initialize Redis client', error);
      process.exit(1);
    }
  },
  inject: [RedisConfig, LoggerService],
};
