import { Module } from '@nestjs/common';
import { CacheModule } from 'src/libs/cache/cache.module';
import { CacheMetricsService } from 'src/libs/cache/metrics/cache-metrics.service';
import { MetricsCacheDecorator } from 'src/libs/cache/metrics/decorators/metrics-cache.decorator';

import { CacheWeatherService } from './cache-weather.service';

export const RawCacheWeatherService = Symbol('RawCacheWeatherService');

@Module({
  imports: [CacheModule],
  providers: [
    {
      provide: RawCacheWeatherService,
      useClass: CacheWeatherService,
    },
    {
      provide: CacheWeatherService,
      useFactory: (raw: CacheWeatherService, metrics: CacheMetricsService) =>
        new MetricsCacheDecorator(raw, metrics, 'weather'),
      inject: [RawCacheWeatherService, CacheMetricsService],
    },
  ],
  exports: [CacheWeatherService],
})
export class CacheWeatherModule {}
