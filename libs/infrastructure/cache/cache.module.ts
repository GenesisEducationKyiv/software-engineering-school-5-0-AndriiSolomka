import { Module } from '@nestjs/common';

import { RedisModule } from './providers/redis.module';
import { RedisRepository } from './providers/redis.repository';
import { CacheRepositoryToken } from '../../core/cache/cache-repository.interface';

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
