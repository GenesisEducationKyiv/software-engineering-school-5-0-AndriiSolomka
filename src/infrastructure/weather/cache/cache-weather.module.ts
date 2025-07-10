import { Module } from '@nestjs/common';
import { CacheModule } from 'src/libs/cache/cache.module';
import { MetricsCacheDecorator } from 'src/libs/decorators/metrics-cache.decorator';
import { MetricsService } from 'src/libs/metrics/metrics.service';

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
      useFactory: (raw: CacheWeatherService, metrics: MetricsService) =>
        new MetricsCacheDecorator(raw, metrics, 'weather'),
      inject: [RawCacheWeatherService, MetricsService],
    },
  ],
  exports: [CacheWeatherService],
})
export class CacheWeatherModule {}
