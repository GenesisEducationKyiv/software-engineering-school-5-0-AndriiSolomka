import { Module } from '@nestjs/common';
import { CacheWeatherService } from 'src/infrastructure/cache/cache-weather.service';
import { MetricsCacheDecorator } from 'src/infrastructure/decorators/metrics-cache.decorator';
import { CacheModule } from 'src/infrastructure/libs/cache/cache.module';
import { MetricsService } from 'src/infrastructure/libs/metrics/metrics.service';

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
