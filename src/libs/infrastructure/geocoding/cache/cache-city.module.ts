import { Module } from '@nestjs/common';
import { CacheModule } from 'src/libs/infrastructure/cache/cache.module';
import { CacheMetricsService } from 'src/libs/infrastructure/cache/metrics/cache-metrics.service';
import { MetricsCacheDecorator } from 'src/libs/infrastructure/cache/metrics/decorators/metrics-cache.decorator';

import { CacheCityService } from './cache-city.service';

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
