import { Inject, Injectable } from '@nestjs/common';
import { CreateWeatherDto } from './dto/create-weather.dto';
import {
  WeatherServiceInterface,
  WeatherToken,
} from './interfaces/weather.service.interface';

@Injectable()
export class WeatherService implements WeatherServiceInterface {
  constructor(
    @Inject(WeatherToken)
    private readonly weatherService: WeatherServiceInterface,
  ) {}

  async getWeather(city: string): Promise<CreateWeatherDto> {
    return this.weatherService.getWeather(city);
  }
}
