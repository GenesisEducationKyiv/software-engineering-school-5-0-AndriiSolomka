import { Controller, Get, Query, UsePipes } from '@nestjs/common';
import { WeatherHandlersService } from './weather-handlers.service';
import { WeatherQueryDto } from './dto/weather-query.dto';
import { CityValidationPipe } from 'src/common/pipes/city-validation.pipe';
import { ApiDocs } from 'src/common/decorators/doc.decorator';
import { WEATHER_DOCS } from 'src/constants/documentation/weather/controller';

@Controller('weather')
export class WeatherHandlersController {
  constructor(private readonly weatherService: WeatherHandlersService) {}

  @UsePipes(CityValidationPipe)
  @ApiDocs(WEATHER_DOCS.getWeather)
  @Get()
  async getWeather(@Query() query: WeatherQueryDto) {
    return await this.weatherService.getWeather(query.city);
  }
}
