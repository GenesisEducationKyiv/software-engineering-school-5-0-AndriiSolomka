import { Controller, Get, Query, UsePipes } from '@nestjs/common';
import { CityValidationPipe } from 'src/common/pipes/city-validation.pipe';
import { WeatherUseCase } from 'src/use-cases/weather-updates/get-weather.use-case';

import { WeatherQueryDto } from '../dto/weather/weather-query.dto';

@Controller('weather')
export class WeatherHandlersController {
  constructor(private readonly weatherService: WeatherUseCase) {}

  @UsePipes(CityValidationPipe)
  @Get()
  async getWeather(@Query() query: WeatherQueryDto) {
    return await this.weatherService.getWeather(query.city);
  }
}
