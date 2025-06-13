import { Module } from '@nestjs/common';
import { RedisRepository } from 'src/redis/redis.repository';
import { RedisModule } from 'src/redis/redis.module';
import { ICacheRepositoryToken } from './interfaces/cache-repository.interface';

@Module({
  imports: [RedisModule],
  providers: [
    {
      provide: ICacheRepositoryToken,
      useClass: RedisRepository,
    },
  ],
  exports: [ICacheRepositoryToken],
})
export class CacheModule {}
