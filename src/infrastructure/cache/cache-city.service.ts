import { Inject, Injectable } from '@nestjs/common';
import { CacheConfig } from 'src/config/cache.config';
import { CacheService } from './cache.service';
import {
  CacheRepositoryInterface,
  CacheRepositoryToken,
} from 'src/core/abstracts/cache/cache-repository.interface';
import { City } from 'src/core/abstracts/geocoding/geocoding.interface';

@Injectable()
export class CacheCityService extends CacheService<City> {
  constructor(
    @Inject(CacheRepositoryToken)
    cache: CacheRepositoryInterface,
    private readonly config: CacheConfig,
  ) {
    super(cache, config.cityCachePrefix, config.cityCacheTTL);
  }
}
