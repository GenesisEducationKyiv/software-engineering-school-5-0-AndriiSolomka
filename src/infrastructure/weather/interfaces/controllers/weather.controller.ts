import { Controller, Get, Inject, Param, UsePipes } from '@nestjs/common';
import { WeatherCityValidationPipe } from 'src/common/pipes/city-validation.pipe';
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

  @UsePipes(WeatherCityValidationPipe)
  @Get(':city')
  async getWeather(@Param('city') city: string) {
    return await this.weatherService.getWeather(city);
  }
}
