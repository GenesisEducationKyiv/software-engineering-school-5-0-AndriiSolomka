import { Module } from '@nestjs/common';
import { RedisModule } from './redis.module';
import { RedisRepository } from 'src/infrastructure/cache/redis.repository';
import { CacheRepositoryToken } from 'src/core/abstracts/cache/cache-repository.interface';

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
