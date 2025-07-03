import { Controller, Get, Query, UsePipes } from '@nestjs/common';
import { WeatherService } from 'src/application/weather/weather.service';
import { CityValidationPipe } from 'src/common/pipes/city-validation.pipe';

import { WeatherQueryDto } from '../dto/weather/weather-query.dto';

@Controller('weather')
export class WeatherHandlersController {
  constructor(private readonly weatherService: WeatherService) {}

  @UsePipes(CityValidationPipe)
  @Get()
  async getWeather(@Query() query: WeatherQueryDto) {
    return await this.weatherService.getWeather(query.city);
  }
}
