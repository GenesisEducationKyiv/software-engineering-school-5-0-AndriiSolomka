import { Module } from '@nestjs/common';
import { CacheModule } from './cache.module';
import { CacheCityService } from 'src/infrastructure/cache/cache-city.service';
import { MetricsService } from 'src/infrastructure/metrics/metrics.service';
import { MetricsCacheDecorator } from 'src/infrastructure/decorators/metrics-cache.decorator';

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
