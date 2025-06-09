import { Module } from '@nestjs/common';
import { CacheCityService } from './cache-city.service';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [RedisModule],
  providers: [CacheCityService],
  exports: [CacheCityService],
})
export class CacheCityModule {}
