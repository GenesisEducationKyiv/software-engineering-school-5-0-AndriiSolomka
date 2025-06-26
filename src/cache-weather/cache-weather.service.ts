import { Injectable, Inject } from '@nestjs/common';
import { CacheService } from 'src/cache/cache.service';
import { CreateWeatherDto } from 'src/weather/dto/create-weather.dto';
import {
  CacheRepository,
  CacheRepositoryToken,
} from 'src/cache/interfaces/cache-repository.interface';
import cacheConfig from 'src/config/cache.config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class CacheWeatherService extends CacheService<CreateWeatherDto> {
  constructor(
    @Inject(CacheRepositoryToken)
    cache: CacheRepository,
    @Inject(cacheConfig.KEY)
    private readonly config: ConfigType<typeof cacheConfig>,
  ) {
    super(cache, config.weatherCachePrefix, config.weatherCacheTTL);
  }
}
