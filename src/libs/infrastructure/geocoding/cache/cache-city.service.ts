import { Inject, Injectable } from '@nestjs/common';
import {
  CacheRepositoryInterface,
  CacheRepositoryToken,
} from 'libs/core/cache/cache-repository.interface';
import { CacheService } from 'libs/infrastructure/cache/cache.service';
import { CacheConfig } from 'src/libs/config/cache.config';
import { City } from 'src/libs/core/geocoding/geocoding.interface';

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
