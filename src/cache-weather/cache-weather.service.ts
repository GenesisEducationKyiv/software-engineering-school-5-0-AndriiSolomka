import { Injectable, Inject } from '@nestjs/common';
import { CacheService } from 'src/cache/cache.service';
import { CreateWeatherDto } from 'src/weather-handlers/dto/create-weather.dto';
import {
  CacheRepository,
  ICacheRepositoryToken,
} from 'src/cache/interfaces/cache-repository.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CacheWeatherService extends CacheService<CreateWeatherDto> {
  constructor(
    @Inject(ICacheRepositoryToken)
    cache: CacheRepository,
    private readonly config: ConfigService,
  ) {
    super(
      cache,
      config.getOrThrow<string>('WEATHER_CACHE.PREFIX'),
      config.getOrThrow<number>('WEATHER_CACHE.TTL'),
    );
  }
}
