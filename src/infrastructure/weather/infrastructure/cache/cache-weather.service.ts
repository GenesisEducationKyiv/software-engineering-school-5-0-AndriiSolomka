import { Inject, Injectable } from '@nestjs/common';
import { CacheConfig } from 'src/infrastructure/weather/config/cache.config';
import { WeatherData } from 'src/infrastructure/weather/core/weather.interface';
import {
  CacheRepositoryInterface,
  CacheRepositoryToken,
} from 'src/libs/core/cache/cache-repository.interface';
import { CacheService } from 'src/libs/infrastructure/cache/cache.service';

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
