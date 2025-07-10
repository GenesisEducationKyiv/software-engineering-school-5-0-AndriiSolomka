import { Inject, Injectable } from '@nestjs/common';
import { CacheConfig } from 'src/config/cache.config';
import { WeatherData } from 'src/infrastructure/weather/core/weather.interface';
import { CacheService } from 'src/libs/cache/cache.service';
import {
  CacheRepositoryInterface,
  CacheRepositoryToken,
} from 'src/libs/cache/core/cache-repository.interface';

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
