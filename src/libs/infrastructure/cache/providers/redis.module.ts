import { Module } from '@nestjs/common';

import { redisClientFactory } from './redis-client.factory';
import { RedisRepository } from './redis.repository';
import { LoggerModule } from '../../logger/logger.module';

@Module({
  imports: [LoggerModule],
  providers: [redisClientFactory, RedisRepository],
  exports: [RedisRepository],
})
export class RedisModule {}
