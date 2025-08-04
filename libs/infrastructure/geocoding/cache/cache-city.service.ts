import { Inject, Injectable } from '@nestjs/common';
import { CacheCityConfig } from 'libs/config/cache.config';
import { City } from 'libs/core/geocoding/geocoding.interface';
import {
  LoggerInterface,
  LoggerToken,
} from 'libs/core/logger/logger.interface';

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
    private readonly config: CacheCityConfig,
    @Inject(LoggerToken)
    logger: LoggerInterface,
  ) {
    super(logger, cache, config.cityCachePrefix, config.cityCacheTTL);
  }
}
