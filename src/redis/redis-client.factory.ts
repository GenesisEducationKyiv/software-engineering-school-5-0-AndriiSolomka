import { FactoryProvider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';
import { AppLoggerService } from '../logger/app-logger.service';

export const REDIS_CLIENT = Symbol('RedisClient');

export const redisClientFactory: FactoryProvider<Redis> = {
  provide: REDIS_CLIENT,
  useFactory: (configService: ConfigService, logger: AppLoggerService) => {
    try {
      const redis = new Redis({
        host: configService.getOrThrow<string>('REDIS_HOST'),
        port: configService.getOrThrow<number>('REDIS_PORT'),
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
  inject: [ConfigService, AppLoggerService],
};
