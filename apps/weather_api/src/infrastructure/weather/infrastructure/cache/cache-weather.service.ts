import { Inject, Injectable } from '@nestjs/common';
import { CacheConfig } from 'apps/weather_api/src/infrastructure/weather/config/cache.config';
import { WeatherData } from 'apps/weather_api/src/infrastructure/weather/core/weather.interface';
import {
  CacheRepositoryInterface,
  CacheRepositoryToken,
} from 'libs/core/cache/cache-repository.interface';
import { CacheService } from 'libs/infrastructure/cache/cache.service';

@Injectable()
export class CacheWeatherService extends CacheService<WeatherData> {
  constructor(
    @Inject(CacheRepositoryToken)
    cache: CacheRepositoryInterface,
    private readonly config: CacheConfig,
  ) {
    super(cache, config.weatherCachePrefix, config.weatherCacheTTL);
  }
}
