import { Module } from '@nestjs/common';
import { redisClientFactory } from 'src/infrastructure/cache/redis-client.factory';
import { RedisRepository } from 'src/infrastructure/cache/redis.repository';

import { LoggerModule } from '../infrastructure/logger.module';

@Module({
  imports: [LoggerModule],
  providers: [redisClientFactory, RedisRepository],
  exports: [RedisRepository],
})
export class RedisModule {}
