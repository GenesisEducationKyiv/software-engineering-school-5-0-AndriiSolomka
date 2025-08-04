import { Inject, Injectable } from '@nestjs/common';
import {
  LoggerInterface,
  LoggerToken,
} from 'libs/core/logger/logger.interface';

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
    @Inject(LoggerToken)
    private readonly logger: LoggerInterface,
  ) {}

  create() {
    const chain = new WeatherProviderChain(this.logger, [
      this.apiProvider,
      this.openMeteo,
    ]);
    return new WeatherCacheProxyService(chain, this.cache);
  }
}
