import { Injectable, Inject } from '@nestjs/common';
import { CacheConfig } from 'src/config/cache.config';
import { WeatherData } from 'src/core/abstracts/weather/weather.interface';
import { CacheService } from './cache.service';
import {
  CacheRepositoryInterface,
  CacheRepositoryToken,
} from 'src/core/abstracts/cache/cache-repository.interface';

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
