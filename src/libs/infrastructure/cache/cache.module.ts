import { Module } from '@nestjs/common';
import { CacheRepositoryToken } from 'libs/core/cache/cache-repository.interface';

import { RedisModule } from './providers/redis.module';
import { RedisRepository } from './providers/redis.repository';

@Module({
  imports: [RedisModule],
  providers: [
    {
      provide: CacheRepositoryToken,
      useExisting: RedisRepository,
    },
  ],
  exports: [CacheRepositoryToken],
})
export class CacheModule {}
