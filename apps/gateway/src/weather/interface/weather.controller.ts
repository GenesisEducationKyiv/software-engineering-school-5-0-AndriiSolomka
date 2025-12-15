import { Controller, Get, Query, UsePipes } from '@nestjs/common';
import { CityValidationPipe } from 'libs/common/pipes/city-validation.pipe';

import { WeatherQueryDto } from './dto/weather-query.dto';
import { WeatherClientService } from '../infrastructure/weather.grpc.client';

@Controller('weather')
export class WeatherHandlersController {
  constructor(private readonly weatherService: WeatherClientService) {}

  @UsePipes(CityValidationPipe)
  @Get()
  async getWeather(@Query() query: WeatherQueryDto) {
    return await this.weatherService.getWeather(query.city);
  }
}
