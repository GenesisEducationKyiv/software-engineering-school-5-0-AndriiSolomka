import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';

import {
  WEATHER_PACKAGE,
  WeatherData,
  WeatherInterface,
} from '../../weather/core/weather.interface';

@Injectable()
export class WeatherClientService implements OnModuleInit {
  private weatherService: WeatherInterface;

  constructor(
    @Inject(WEATHER_PACKAGE)
    private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.weatherService =
      this.client.getService<WeatherInterface>('WeatherService');
  }

  async getWeather(city: string): Promise<WeatherData> {
    return this.weatherService.getWeather({ city });
  }
}
