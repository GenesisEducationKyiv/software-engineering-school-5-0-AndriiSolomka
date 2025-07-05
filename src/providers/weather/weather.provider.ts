import { InternalServerErrorException } from '@nestjs/common';
import { CreateWeatherDto } from 'src/weather/dto/create-weather.dto';

export interface WeatherProvider {
  getWeather(city: string): Promise<CreateWeatherDto>;
}

export class WeatherProviderChain implements WeatherProvider {
  constructor(private readonly providers: WeatherProvider[]) {}

  async getWeather(city: string): Promise<CreateWeatherDto> {
    for (const provider of this.providers) {
      try {
        return await provider.getWeather(city);
      } catch {
        continue;
      }
    }

    throw new InternalServerErrorException(
      'No weather provider could handle the request',
    );
  }
}
