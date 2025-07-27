import { Injectable } from '@nestjs/common';
import { LoggerService } from 'libs/infrastructure/logger/logger.service';

import { CacheWeatherService } from './infrastructure/cache/cache-weather.service';
import { LoggingWeatherProviderDecorator } from './infrastructure/decorators/providers-logging.decorator';
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
    private readonly logger: LoggerService,
  ) {}

  create() {
    const loggedWeatherApi = new LoggingWeatherProviderDecorator(
      this.apiProvider,
      this.logger,
      'WeatherApiProviderService',
    );
    const loggedMeteo = new LoggingWeatherProviderDecorator(
      this.openMeteo,
      this.logger,
      'OpenMeteoProviderService',
    );

    const chain = new WeatherProviderChain([loggedWeatherApi, loggedMeteo]);
    return new WeatherCacheProxyService(chain, this.cache);
  }
}
