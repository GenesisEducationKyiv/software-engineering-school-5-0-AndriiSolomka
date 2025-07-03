import { Controller, Get, Query, UsePipes } from '@nestjs/common';
import { CityValidationPipe } from 'src/common/pipes/city-validation.pipe';
import { WeatherQueryDto } from '../dto/weather/weather-query.dto';
import { WeatherService } from 'src/application/weather/weather.service';

@Controller('weather')
export class WeatherHandlersController {
  constructor(private readonly weatherService: WeatherService) {}

  @UsePipes(CityValidationPipe)
  @Get()
  async getWeather(@Query() query: WeatherQueryDto) {
    return await this.weatherService.getWeather(query.city);
  }
}
