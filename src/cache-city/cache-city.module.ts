import { Module } from '@nestjs/common';
import { CacheCityService } from './cache-city.service';
import { CacheModule } from 'src/cache/cache.module';
import { MetricsCacheDecorator } from 'src/metrics/decorators/cache-metric.decorator';
import { MetricsService } from 'src/metrics/metrics.service';

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
