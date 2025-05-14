import { FactoryProvider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';
import { AppLoggerService } from '../logger/logger.service';

export const redisClientFactory: FactoryProvider<Redis> = {
  provide: 'RedisClient',
  useFactory: (configService: ConfigService, logger: AppLoggerService) => {
    try {
      const redis = new Redis({
        host: configService.get<string>('REDIS_HOST', 'localhost'),
        port: configService.get<number>('REDIS_PORT', 6379),
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
