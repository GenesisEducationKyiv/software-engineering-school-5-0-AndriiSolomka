import { Inject, Injectable } from '@nestjs/common';
import { CacheConfig } from 'src/config/cache.config';
import { City } from 'src/core/abstracts/geocoding/geocoding.interface';
import {
  CacheRepositoryInterface,
  CacheRepositoryToken,
} from 'src/libs/cache/core/cache-repository.interface';

import { CacheService } from '../../cache/cache.service';

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
