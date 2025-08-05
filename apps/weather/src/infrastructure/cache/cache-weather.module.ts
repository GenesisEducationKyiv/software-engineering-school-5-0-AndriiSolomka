import { Module } from '@nestjs/common';
import { CacheModule } from 'libs/infrastructure/cache/cache.module';
import { LoggerModule } from 'libs/infrastructure/logger/logger.module';

import { CacheWeatherFactory } from './cache-weather.factory';
import { CacheWeatherService } from './cache-weather.service';
import { MetricsModule } from '../metrics/metrics.module';

@Module({
  imports: [CacheModule, LoggerModule, MetricsModule],
  providers: [
    CacheWeatherFactory,
    {
      provide: CacheWeatherService,
      useFactory: (factory: CacheWeatherFactory) => factory.create(),
      inject: [CacheWeatherFactory],
    },
  ],
  exports: [CacheWeatherService],
})
export class CacheWeatherModule {}
