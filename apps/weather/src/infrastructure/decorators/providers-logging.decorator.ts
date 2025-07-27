import { Inject } from '@nestjs/common';
import {
  LoggerInterface,
  LoggerToken,
} from 'libs/core/logger/logger.interface';

import { WeatherProviderInterface } from '../../core/weather-provider.interface';
import { WeatherData } from '../../core/weather.interface';

export class LoggingWeatherProviderDecorator
  implements WeatherProviderInterface
{
  constructor(
    private readonly wrapped: WeatherProviderInterface,
    @Inject(LoggerToken)
    private readonly logger: LoggerInterface,
    private readonly context: string,
  ) {}

  async getWeather(city: string): Promise<WeatherData> {
    try {
      const result = await this.wrapped.getWeather(city);
      this.logger.info({
        context: this.context,
        operation: 'provider_getWeather',
        city,
        status: 'success',
      });
      return result;
    } catch (error) {
      this.logger.error({
        context: this.context,
        operation: 'provider_getWeather',
        city,
        status: 'fail',
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }
}
