import { Module } from '@nestjs/common';
import { CacheRepositoryToken } from 'src/core/abstracts/cache/cache-repository.interface';

import { RedisModule } from '../redis/redis.module';
import { RedisRepository } from '../redis/redis.repository';

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
