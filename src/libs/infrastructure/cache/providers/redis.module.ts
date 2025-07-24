import { Module } from '@nestjs/common';
import { LoggerModule } from 'src/libs/infrastructure/logger/logger.module';

import { redisClientFactory } from './redis-client.factory';
import { RedisRepository } from './redis.repository';

@Module({
  imports: [LoggerModule],
  providers: [redisClientFactory, RedisRepository],
  exports: [RedisRepository],
})
export class RedisModule {}
