import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { CacheService } from 'src/cache/cache.service';
import {
  CacheRepository,
  CacheRepositoryToken,
} from 'src/cache/interfaces/cache-repository.interface';
import cacheConfig from 'src/config/cache.config';
import { GeocodingResponse } from 'src/constants/types/weather/weather-client.interface';

@Injectable()
export class CacheCityService extends CacheService<GeocodingResponse> {
  constructor(
    @Inject(CacheRepositoryToken)
    cache: CacheRepository,
    @Inject(cacheConfig.KEY)
    private readonly config: ConfigType<typeof cacheConfig>,
  ) {
    super(cache, config.cityCachePrefix, config.cityCacheTTL);
  }
}
