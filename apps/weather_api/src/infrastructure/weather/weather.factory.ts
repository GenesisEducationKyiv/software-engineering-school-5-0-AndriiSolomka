import { Injectable } from '@nestjs/common';

import { CacheWeatherService } from './infrastructure/cache/cache-weather.service';
import { OpenMeteoProviderService } from './infrastructure/providers/open-meteo.provider';
import { WeatherApiProviderService } from './infrastructure/providers/weather-api.provider';
import { WeatherProviderChain } from './infrastructure/providers/weather.provider';
import { WeatherCacheProxyService } from './infrastructure/proxy/weather-cache-proxy.service';

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
