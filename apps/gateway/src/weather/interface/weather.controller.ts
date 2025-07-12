import { Controller, Get, Query } from '@nestjs/common';

import { WeatherQueryDto } from './dto/weather-query.dto';
import { WeatherClientService } from '../infrastructure/weather.grpc.client';

@Controller('weather')
export class WeatherHandlersController {
  constructor(private readonly weatherService: WeatherClientService) {}

  @Get()
  async getWeather(@Query() query: WeatherQueryDto) {
    return await this.weatherService.getWeather(query.city);
  }
}
