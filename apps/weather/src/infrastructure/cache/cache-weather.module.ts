import { Module } from '@nestjs/common';
import { CacheCityConfig } from 'libs/config/cache.config';
import { GeocodingConfig } from 'libs/config/geocoding.config';
import { CacheModule } from 'libs/infrastructure/cache/cache.module';
import { CacheMetricsService } from 'libs/infrastructure/cache/metrics/cache-metrics.service';
import { MetricsCacheDecorator } from 'libs/infrastructure/cache/metrics/decorators/metrics-cache.decorator';

import { CacheWeatherService } from './cache-weather.service';

export const RawCacheWeatherService = Symbol('RawCacheWeatherService');

@Module({
  imports: [CacheModule],
  providers: [
    CacheCityConfig,
    GeocodingConfig,
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
