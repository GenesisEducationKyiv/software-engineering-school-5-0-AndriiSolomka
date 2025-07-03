import { Module } from '@nestjs/common';
import { CacheWeatherService } from 'src/infrastructure/cache/cache-weather.service';
import { CacheModule } from './cache.module';
import { MetricsService } from 'src/infrastructure/metrics/metrics.service';
import { MetricsCacheDecorator } from 'src/infrastructure/decorators/metrics-cache.decorator';

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
