import { Injectable } from '@nestjs/common';

import { CacheWeatherService } from 'src/cache-weather/cache-weather.service';
import { OpenMeteoProviderService } from 'src/providers/weather/open-meteo.provider';
import { WeatherApiProviderService } from 'src/providers/weather/weather-api.provider';
import { WeatherCacheProxyService } from 'src/proxy/weather/weather-cache-proxy.service';

@Injectable()
export class WeatherFactoryService {
  constructor(
    private readonly apiProvider: WeatherApiProviderService,
    private readonly openMeteo: OpenMeteoProviderService,
    private readonly cache: CacheWeatherService,
  ) {}

  create() {
    this.apiProvider.setNext(this.openMeteo);
    return new WeatherCacheProxyService(this.apiProvider, this.cache);
  }
}
