import { Module } from '@nestjs/common';
import { RedisRepository } from 'src/redis/redis.repository';
import { RedisModule } from 'src/redis/redis.module';
import { CacheRepositoryToken } from './interfaces/cache-repository.interface';

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
