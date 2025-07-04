import { Inject, Injectable } from '@nestjs/common';
import {
  WeatherData,
  WeatherInterface,
  WeatherToken,
} from 'src/core/abstracts/weather/weather.interface';

@Injectable()
export class WeatherUseCase implements WeatherInterface {
  constructor(
    @Inject(WeatherToken)
    private readonly weatherService: WeatherInterface,
  ) {}

  async getWeather(city: string): Promise<WeatherData> {
    return await this.weatherService.getWeather(city);
  }
}
