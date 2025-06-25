import { Module } from '@nestjs/common';
import { RedisRepository } from './redis.repository';
import { REDIS_CLIENT, redisClientFactory } from './redis-client.factory';
import { LoggerModule } from 'src/logger/logger.module';

@Module({
  imports: [LoggerModule],
  providers: [redisClientFactory, RedisRepository],
  exports: [RedisRepository, REDIS_CLIENT],
})
export class RedisModule {}
