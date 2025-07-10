import { Module } from '@nestjs/common';

import { CacheCityService } from './cache-city.service';
import { CacheModule } from '../../cache/cache.module';
import { MetricsCacheDecorator } from '../../decorators/metrics-cache.decorator';
import { MetricsService } from '../../metrics/metrics.service';

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
      useFactory: (raw: CacheCityService, metrics: MetricsService) =>
        new MetricsCacheDecorator(raw, metrics, 'city'),
      inject: [RawCacheCityService, MetricsService],
    },
  ],
  exports: [CacheCityService],
})
export class CacheCityModule {}
