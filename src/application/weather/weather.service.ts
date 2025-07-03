import { Injectable } from '@nestjs/common';
import {
  WeatherData,
  WeatherInterface,
} from 'src/core/abstracts/weather/weather.interface';

@Injectable()
export class WeatherService implements WeatherInterface {
  constructor(private readonly weatherService: WeatherInterface) {}

  async getWeather(city: string): Promise<WeatherData> {
    return await this.weatherService.getWeather(city);
  }
}
