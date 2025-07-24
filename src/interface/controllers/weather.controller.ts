import { Controller, Get, Query } from '@nestjs/common';
import { WeatherApiClient } from 'src/infrastructure/weather/weather.client';
import { WeatherQueryDto } from 'src/interface/dto/weather/weather-query.dto';

@Controller('weather')
export class WeatherHandlersController {
  constructor(private readonly weatherService: WeatherApiClient) {}

  @Get()
  async getWeather(@Query() query: WeatherQueryDto) {
    return await this.weatherService.getWeather(query.city);
  }
}
