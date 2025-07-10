import { Inject, Injectable } from '@nestjs/common';
import { CacheConfig } from 'src/config/cache.config';
import {
  CacheRepositoryInterface,
  CacheRepositoryToken,
} from 'src/core/abstracts/cache/cache-repository.interface';
import { WeatherData } from 'src/core/abstracts/weather/weather.interface';
import { CacheService } from 'src/libs/cache/cache.service';

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
