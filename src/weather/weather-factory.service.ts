import { Injectable } from '@nestjs/common';
import { CacheWeatherService } from 'src/cache-weather/cache-weather.service';
import { OpenMeteoProviderService } from 'src/providers/weather/open-meteo.provider';
import { WeatherApiProviderService } from 'src/providers/weather/weather-api.provider';
import { WeatherProviderChain } from 'src/providers/weather/weather.provider';
import { WeatherCacheProxyService } from 'src/proxy/weather/weather-cache-proxy.service';

@Injectable()
export class WeatherFactoryService {
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
