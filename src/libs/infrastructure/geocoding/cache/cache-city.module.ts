import { Module } from '@nestjs/common';

import { CacheCityService } from './cache-city.service';
import { CacheModule } from '../../cache/cache.module';
import { CacheMetricsService } from '../../cache/metrics/cache-metrics.service';
import { MetricsCacheDecorator } from '../../cache/metrics/decorators/metrics-cache.decorator';

const RawCacheCityService = Symbol('RawCacheCityService');

@Module({
  imports: [CacheModule],
  providers: [
    {
      provide: RawCacheCityService,
      useClass: CacheCityService,
    },
    {
      provide: CacheCityService,
      useFactory: (raw: CacheCityService, metrics: CacheMetricsService) =>
        new MetricsCacheDecorator(raw, metrics, 'city'),
      inject: [RawCacheCityService, CacheMetricsService],
    },
  ],
  exports: [CacheCityService],
})
export class CacheCityModule {}
