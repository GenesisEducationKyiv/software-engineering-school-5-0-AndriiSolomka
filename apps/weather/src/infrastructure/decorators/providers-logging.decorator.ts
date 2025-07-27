import { LoggerInterface } from 'libs/core/logger/logger.interface';
import { LoggingDecoratorBase } from 'libs/infrastructure/logger/logger.abstract';

import { WeatherProviderInterface } from '../../core/weather-provider.interface';
import { WeatherData } from '../../core/weather.interface';

export class LoggingWeatherProviderDecorator
  extends LoggingDecoratorBase<WeatherProviderInterface>
  implements WeatherProviderInterface
{
  constructor(
    wrapped: WeatherProviderInterface,
    logger: LoggerInterface,
    context: string,
  ) {
    super(wrapped, logger, context);
  }

  getWeather(city: string): Promise<WeatherData> {
    return this.logAndExecute('getWeather', { city }, () =>
      this.wrapped.getWeather(city),
    );
  }
}
