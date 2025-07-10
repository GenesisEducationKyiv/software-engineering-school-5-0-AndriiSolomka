import { Module } from '@nestjs/common';
import { CacheRepositoryToken } from 'src/core/abstracts/cache/cache-repository.interface';
import { RedisRepository } from 'src/infrastructure/libs/redis/redis.repository';
import { RedisModule } from '../redis/redis.module';


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
