import { Injectable } from '@nestjs/common';
import { OpenMeteoProviderService } from 'src/infrastructure/weather/providers/open-meteo.provider';
import { WeatherApiProviderService } from 'src/infrastructure/weather/providers/weather-api.provider';
import { WeatherProviderChain } from 'src/infrastructure/weather/providers/weather.provider';
import { WeatherCacheProxyService } from 'src/infrastructure/weather/proxy/weather-cache-proxy.service';

import { CacheWeatherService } from './cache/cache-weather.service';

@Injectable()
export class WeatherFactory {
  constructor(
    private readonly apiProvider: WeatherApiProviderService,
    private readonly openMeteo: OpenMeteoProviderService,
    private readonly cache: CacheWeatherService,
  ) {}

  create() {
    const chain = new WeatherProviderChain([this.apiProvider, this.openMeteo]);
    return new WeatherCacheProxyService(chain, this.cache);
  }
}
