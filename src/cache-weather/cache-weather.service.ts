import { Injectable, Inject } from '@nestjs/common';
import { CacheService } from 'src/cache/cache.service';
import { CreateWeatherDto } from 'src/weather/dto/create-weather.dto';
import {
  CacheRepository,
  CacheRepositoryToken,
} from 'src/cache/interfaces/cache-repository.interface';
import { CacheConfig } from 'src/config/cache.config';

@Injectable()
export class CacheWeatherService extends CacheService<CreateWeatherDto> {
  constructor(
    @Inject(CacheRepositoryToken)
    cache: CacheRepository,
    private readonly config: CacheConfig,
  ) {
    super(cache, config.weatherCachePrefix, config.weatherCacheTTL);
  }
}
