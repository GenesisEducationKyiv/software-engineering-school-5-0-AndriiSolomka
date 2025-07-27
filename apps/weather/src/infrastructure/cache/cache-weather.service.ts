import { Injectable } from '@nestjs/common';
import { CacheConfig } from 'apps/weather/config/cache.config';
import { WeatherData } from 'apps/weather/src/core/weather.interface';
import { CacheRepositoryInterface } from 'libs/core/cache/cache-repository.interface';
import { CacheService } from 'libs/infrastructure/cache/cache.service';

@Injectable()
export class CacheWeatherService extends CacheService<WeatherData> {
  constructor(
    cache: CacheRepositoryInterface,
    private readonly config: CacheConfig,
  ) {
    super(cache, config.weatherCachePrefix, config.weatherCacheTTL);
  }
}
