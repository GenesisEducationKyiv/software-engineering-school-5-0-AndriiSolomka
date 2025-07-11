import { Controller, Get, Inject, Param, UsePipes } from '@nestjs/common';
import {
  WeatherInterface,
  WeatherToken,
} from 'apps/weather_api/src/infrastructure/weather/core/weather.interface';
import { WeatherCityValidationPipe } from 'common/pipes/city-validation.pipe';

@Controller('internal/weather')
export class WeatherInternalController {
  constructor(
    @Inject(WeatherToken)
    private readonly weatherService: WeatherInterface,
  ) {}

  @UsePipes(WeatherCityValidationPipe)
  @Get(':city')
  async getWeather(@Param('city') city: string) {
    return await this.weatherService.getWeather(city);
  }
}
