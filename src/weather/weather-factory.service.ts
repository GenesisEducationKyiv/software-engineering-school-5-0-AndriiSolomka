import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { CacheWeatherService } from 'src/cache-weather/cache-weather.service';
import { WeatherLoggingDecorator } from 'src/common/decorators/weather-logger.decorator';
import loggingConfig from 'src/config/logging.config';
import { OpenMeteoProviderService } from 'src/providers/weather/open-meteo.provider';
import { WeatherApiProviderService } from 'src/providers/weather/weather-api.provider';
import { WeatherCacheProxyService } from 'src/proxy/weather/weather-cache-proxy.service';

@Injectable()
export class WeatherFactoryService {
  constructor(
    private readonly apiProvider: WeatherApiProviderService,
    private readonly openMeteo: OpenMeteoProviderService,
    private readonly cache: CacheWeatherService,
    @Inject(loggingConfig.KEY)
    private readonly config: ConfigType<typeof loggingConfig>,
  ) {}

  create() {
    const decoratedApiProvider = new WeatherLoggingDecorator(
      this.apiProvider,
      'WeatherAPI',
      this.config.enableFileLogging,
    );
    const decoratedOpenMeteo = new WeatherLoggingDecorator(
      this.openMeteo,
      'OpenMeteo',
      this.config.enableFileLogging,
    );

    decoratedApiProvider.setNext(decoratedOpenMeteo);
    return new WeatherCacheProxyService(decoratedApiProvider, this.cache);
  }
}
