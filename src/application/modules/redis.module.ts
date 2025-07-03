import { Module } from '@nestjs/common';
import { LoggerModule } from './logger.module';
import {
  REDIS_CLIENT,
  redisClientFactory,
} from 'src/infrastructure/cache/redis-client.factory';
import { RedisRepository } from 'src/infrastructure/cache/redis.repository';

@Module({
  imports: [LoggerModule],
  providers: [redisClientFactory, RedisRepository],
  exports: [RedisRepository, REDIS_CLIENT],
})
export class RedisModule {}
