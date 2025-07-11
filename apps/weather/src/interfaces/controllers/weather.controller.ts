import { Inject, Param, UsePipes } from '@nestjs/common';
import { GrpcMethod, GrpcService } from '@nestjs/microservices';
import {
  WeatherInterface,
  WeatherToken,
} from 'apps/weather/src/core/weather.interface';
import { WeatherCityValidationPipe } from 'common/pipes/city-validation.pipe';

@GrpcService()
export class WeatherController {
  constructor(
    @Inject(WeatherToken)
    private readonly weatherService: WeatherInterface,
  ) {}

  @UsePipes(WeatherCityValidationPipe)
  @GrpcMethod('WeatherService', 'GetWeather')
  async getWeather(@Param('city') city: string) {
    return await this.weatherService.getWeather(city);
  }
}
