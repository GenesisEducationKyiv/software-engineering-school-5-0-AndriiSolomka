import { Injectable, Inject } from '@nestjs/common';
import { CacheService } from 'src/cache/cache.service';
import { CreateWeatherDto } from 'src/weather-handlers/dto/create-weather.dto';
import {
  ICacheRepository,
  ICacheRepositoryToken,
} from 'src/cache/interfaces/cache-repository.interface';
import { WEATHER_CASH } from 'src/constants/enums/cache/weather-cash.enum';

@Injectable()
export class CacheWeatherService extends CacheService<CreateWeatherDto> {
  constructor(
    @Inject(ICacheRepositoryToken)
    cache: ICacheRepository,
  ) {
    super(cache, WEATHER_CASH.PREFIX, WEATHER_CASH.TTL);
  }
}
