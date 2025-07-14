import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { GrpcToObservable } from 'libs/common/types/observable';
import { firstValueFrom } from 'rxjs';

import {
  WEATHER_PACKAGE,
  WeatherData,
  WeatherInterface,
} from '../core/weather.interface';

@Injectable()
export class WeatherClientService implements OnModuleInit {
  private weatherService: GrpcToObservable<WeatherInterface>;

  constructor(
    @Inject(WEATHER_PACKAGE)
    private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.weatherService =
      this.client.getService<GrpcToObservable<WeatherInterface>>(
        'WeatherService',
      );
  }

  async getWeather(city: string): Promise<WeatherData> {
    return await firstValueFrom(this.weatherService.getWeather({ city }));
  }
}
