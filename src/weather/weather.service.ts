import { Injectable } from '@nestjs/common';
import { CreateWeatherDto } from './dto/create-weather.dto';
import { WeatherInterface } from './interfaces/weather.service.interface';

@Injectable()
export class WeatherService implements WeatherInterface {
  constructor(private readonly weatherProvider: WeatherInterface) {}

  async getWeather(city: string): Promise<CreateWeatherDto> {
    return this.weatherProvider.getWeather(city);
  }
}
