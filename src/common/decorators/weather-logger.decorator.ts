import { WeatherProvider } from 'src/providers/weather/weather.provider';
import { appendToLogFile } from 'src/utils/logger/custom.logger';
import { CreateWeatherDto } from 'src/weather/dto/create-weather.dto';

export class WeatherLoggingDecorator extends WeatherProvider {
  constructor(
    private readonly wrapped: WeatherProvider,
    private readonly providerName: string,
  ) {
    super();
  }

  async getWeather(city: string): Promise<CreateWeatherDto> {
    const result = await this.wrapped.getWeather(city);
    const logMessage = this.buildMessage(city, result);
    appendToLogFile(logMessage);
    return result;
  }

  private buildMessage(city: string, result: CreateWeatherDto): string {
    return `${new Date().toISOString()} | ${this.providerName} - Response for "${city}": ${JSON.stringify(result)}\n`;
  }
}
