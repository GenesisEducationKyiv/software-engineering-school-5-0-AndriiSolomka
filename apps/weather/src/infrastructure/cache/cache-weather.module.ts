import { Module } from '@nestjs/common';
import { CacheConfig } from 'apps/weather/config/cache.config';
import {
  CacheRepositoryInterface,
  CacheRepositoryToken,
} from 'libs/core/cache/cache-repository.interface';
import {
  LoggerInterface,
  LoggerToken,
} from 'libs/core/logger/logger.interface';
import { CacheModule } from 'libs/infrastructure/cache/cache.module';
import { LoggingCacheDecorator } from 'libs/infrastructure/cache/decorators/cache-logger.decorator';
import { LoggerModule } from 'libs/infrastructure/logger/logger.module';

import { CacheWeatherService } from './cache-weather.service';

@Module({
  imports: [CacheModule, LoggerModule],
  providers: [
    {
      provide: CacheWeatherService,
      useFactory: (
        cache: CacheRepositoryInterface,
        logger: LoggerInterface,
        config: CacheConfig,
      ) => {
        const original = new CacheWeatherService(cache, config);
        return new LoggingCacheDecorator(
          original,
          logger,
          'CacheWeatherService',
        );
      },
      inject: [CacheRepositoryToken, LoggerToken, CacheConfig],
    },
  ],
  exports: [CacheWeatherService],
})
export class CacheWeatherModule {}
