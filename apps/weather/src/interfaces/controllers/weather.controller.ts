import { Controller, Inject } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import {
  GetWeatherRequest,
  GetWeatherResponse,
} from 'libs/proto/generated/weather';

import { WeatherInterface, WeatherToken } from '../../core/weather.interface';

@Controller('internal/weather')
export class WeatherController {
  constructor(
    @Inject(WeatherToken)
    private readonly weatherService: WeatherInterface,
  ) {}

  @GrpcMethod('WeatherService', 'GetWeather')
  async getWeather({ city }: GetWeatherRequest): Promise<GetWeatherResponse> {
    return await this.weatherService.getWeather(city);
  }
}
