import { Controller, Get, Query } from '@nestjs/common';
import { WeatherApiClient } from 'apps/weather_api/src/infrastructure/weather/interfaces/client/weather.client';

import { WeatherQueryDto } from '../dto/weather/weather-query.dto';

@Controller('weather')
export class WeatherHandlersController {
  constructor(private readonly weatherService: WeatherApiClient) {}

  @Get()
  async getWeather(@Query() query: WeatherQueryDto) {
    return await this.weatherService.getWeather(query.city);
  }
}
