import { InternalServerErrorException } from '@nestjs/common';
import { WeatherProviderInterface } from 'src/infrastructure/weather/core/weather-provider.interface';
import { WeatherData } from 'src/infrastructure/weather/core/weather.interface';

export class WeatherProviderChain implements WeatherProviderInterface {
  constructor(private readonly providers: WeatherProviderInterface[]) {}

  async getWeather(city: string): Promise<WeatherData> {
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
