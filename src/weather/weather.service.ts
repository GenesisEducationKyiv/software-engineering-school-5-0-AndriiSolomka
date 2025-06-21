import { Inject, Injectable } from '@nestjs/common';
import { CreateWeatherDto } from './dto/create-weather.dto';
import {
  WeatherInterface,
  WeatherToken,
} from './interfaces/weather.service.interface';

@Injectable()
export class WeatherService implements WeatherInterface {
  constructor(
    @Inject(WeatherToken)
    private readonly weatherService: WeatherInterface,
  ) {}

  async getWeather(city: string): Promise<CreateWeatherDto> {
    return this.weatherService.getWeather(city);
  }
}
