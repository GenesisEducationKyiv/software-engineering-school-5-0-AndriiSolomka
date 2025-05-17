import { Module } from '@nestjs/common';
import { CacheWeatherService } from './cache-weather.service';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [RedisModule],
  providers: [CacheWeatherService],
  exports: [CacheWeatherService],
})
export class CacheWeatherModule {}
