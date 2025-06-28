import { Module } from '@nestjs/common';
import { CacheWeatherService } from './cache-weather.service';
import { CacheModule } from 'src/cache/cache.module';
import { MetricsService } from 'src/metrics/metrics.service';
import { MetricsCacheDecorator } from 'src/metrics/decorators/cache-metric.decorator';

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
