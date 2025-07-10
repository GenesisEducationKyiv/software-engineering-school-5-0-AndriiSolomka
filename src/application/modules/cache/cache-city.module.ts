import { Module } from '@nestjs/common';
import { CacheCityService } from 'src/infrastructure/cache/cache-city.service';
import { MetricsCacheDecorator } from 'src/infrastructure/decorators/metrics-cache.decorator';
import { CacheModule } from 'src/infrastructure/libs/cache/cache.module';
import { MetricsService } from 'src/infrastructure/libs/metrics/metrics.service';

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
