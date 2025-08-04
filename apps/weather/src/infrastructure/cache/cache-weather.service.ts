import { Inject, Injectable } from '@nestjs/common';
import { CacheConfig } from 'apps/weather/config/cache.config';
import { WeatherData } from 'apps/weather/src/core/weather.interface';
import { CacheRepositoryInterface } from 'libs/core/cache/cache-repository.interface';
import {
  LoggerInterface,
  LoggerToken,
} from 'libs/core/logger/logger.interface';
import { CacheService } from 'libs/infrastructure/cache/cache.service';

@Injectable()
export class CacheWeatherService extends CacheService<WeatherData> {
  constructor(
    @Inject(LoggerToken)
    logger: LoggerInterface,
    cache: CacheRepositoryInterface,
    private readonly config: CacheConfig,
  ) {
    super(logger, cache, config.weatherCachePrefix, config.weatherCacheTTL);
  }
}
