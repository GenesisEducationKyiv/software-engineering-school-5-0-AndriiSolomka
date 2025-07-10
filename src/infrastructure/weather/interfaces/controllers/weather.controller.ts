import { Controller, Get, Inject, Param } from '@nestjs/common';
import {
  WeatherInterface,
  WeatherToken,
} from 'src/infrastructure/weather/core/weather.interface';

@Controller('internal/weather')
export class WeatherInternalController {
  constructor(
    @Inject(WeatherToken)
    private readonly weatherService: WeatherInterface,
  ) {}

  @Get(':city')
  async getWeather(@Param('city') city: string) {
    return await this.weatherService.getWeather(city);
  }
}
