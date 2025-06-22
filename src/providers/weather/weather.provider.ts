import { InternalServerErrorException } from '@nestjs/common';
import { CreateWeatherDto } from 'src/weather/dto/create-weather.dto';

export abstract class WeatherProvider {
  private next: WeatherProvider;

  setNext(provider: WeatherProvider): WeatherProvider {
    this.next = provider;
    return provider;
  }

  async handle(city: string): Promise<CreateWeatherDto> {
    try {
      return await this.getWeather(city);
    } catch {
      if (this.next) return this.next.handle(city);
      throw new InternalServerErrorException(
        'No weather provider could handle the request',
      );
    }
  }

  abstract getWeather(city: string): Promise<CreateWeatherDto>;
}
