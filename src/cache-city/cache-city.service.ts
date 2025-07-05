import { Inject, Injectable } from '@nestjs/common';
import { CacheService } from 'src/cache/cache.service';
import {
  CacheRepository,
  CacheRepositoryToken,
} from 'src/cache/interfaces/cache-repository.interface';
import { CacheConfig } from 'src/config/cache.config';
import { GeocodingResponse } from 'src/geocoding/interfaces/geocoding.interface';

@Injectable()
export class CacheCityService extends CacheService<GeocodingResponse> {
  constructor(
    @Inject(CacheRepositoryToken)
    cache: CacheRepository,
    private readonly config: CacheConfig,
  ) {
    super(cache, config.cityCachePrefix, config.cityCacheTTL);
  }
}
