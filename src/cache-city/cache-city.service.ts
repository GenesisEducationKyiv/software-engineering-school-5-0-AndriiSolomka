import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CacheService } from 'src/cache/cache.service';
import {
  CacheRepository,
  CacheRepositoryToken,
} from 'src/cache/interfaces/cache-repository.interface';
import { ILocation } from 'src/constants/types/weather/weather-client.interface';

@Injectable()
export class CacheCityService extends CacheService<ILocation[]> {
  constructor(
    @Inject(CacheRepositoryToken)
    cache: CacheRepository,
    private readonly config: ConfigService,
  ) {
    super(
      cache,
      config.getOrThrow<string>('CITY_CACHE.PREFIX'),
      config.getOrThrow<number>('CITY_CACHE.TTL'),
    );
  }
}
