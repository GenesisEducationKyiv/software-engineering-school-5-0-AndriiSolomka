import { Module } from '@nestjs/common';
import { CacheRepositoryToken } from 'src/core/abstracts/cache/cache-repository.interface';
import { RedisRepository } from 'src/infrastructure/cache/redis.repository';

import { RedisModule } from './redis.module';

@Module({
  imports: [RedisModule],
  providers: [
    {
      provide: CacheRepositoryToken,
      useClass: RedisRepository,
    },
  ],
  exports: [CacheRepositoryToken],
})
export class CacheModule {}
