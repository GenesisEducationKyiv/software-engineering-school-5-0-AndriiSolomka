import { Inject, Injectable } from '@nestjs/common';
import { CacheConfig } from 'src/libs/config/cache.config';
import { City } from 'src/libs/core/geocoding/geocoding.interface';

import {
  CacheRepositoryInterface,
  CacheRepositoryToken,
} from '../../../core/cache/cache-repository.interface';
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
