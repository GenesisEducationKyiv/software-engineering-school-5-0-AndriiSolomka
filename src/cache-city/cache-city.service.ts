import { Inject, Injectable } from '@nestjs/common';
import { CacheService } from 'src/cache/cache.service';
import {
  ICacheRepository,
  ICacheRepositoryToken,
} from 'src/cache/interfaces/cache-repository.interface';
import { CITY_CASH } from 'src/constants/enums/cache/city-cash.enum';
import { ILocation } from 'src/constants/types/weather/weather-client.interface';

@Injectable()
export class CacheCityService extends CacheService<ILocation[]> {
  constructor(
    @Inject(ICacheRepositoryToken)
    cache: ICacheRepository,
  ) {
    super(cache, CITY_CASH.PREFIX, CITY_CASH.TTL);
  }
}
