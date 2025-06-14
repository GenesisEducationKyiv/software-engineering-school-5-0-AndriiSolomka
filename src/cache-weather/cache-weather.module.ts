import { Module } from '@nestjs/common';
import { CacheWeatherService } from './cache-weather.service';
import { CacheModule } from 'src/cache/cache.module';

@Module({
  imports: [CacheModule],
  providers: [CacheWeatherService],
  exports: [CacheWeatherService],
})
export class CacheWeatherModule {}
