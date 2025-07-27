import { LoggerService } from 'libs/infrastructure/logger/logger.service';

import { WeatherProviderInterface } from '../../core/weather-provider.interface';
import { WeatherData } from '../../core/weather.interface';

export class LoggingWeatherProviderDecorator
  implements WeatherProviderInterface
{
  constructor(
    private readonly wrapped: WeatherProviderInterface,
    private readonly logger: LoggerService,
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
