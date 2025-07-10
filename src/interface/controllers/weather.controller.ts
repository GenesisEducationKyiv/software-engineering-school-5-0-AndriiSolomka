import { Controller, Get, Query, UsePipes } from '@nestjs/common';
import { CityValidationPipe } from 'src/common/pipes/city-validation.pipe';
import { WeatherApiClient } from 'src/infrastructure/weather/api/client/weather.client';

import { WeatherQueryDto } from '../dto/weather/weather-query.dto';

@Controller('weather')
export class WeatherHandlersController {
  constructor(private readonly weatherService: WeatherApiClient) {}

  @UsePipes(CityValidationPipe)
  @Get()
  async getWeather(@Query() query: WeatherQueryDto) {
    return await this.weatherService.getWeather(query.city);
  }
}
