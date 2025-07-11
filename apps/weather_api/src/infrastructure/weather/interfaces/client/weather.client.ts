import { Injectable } from '@nestjs/common';
import {
  WeatherData,
  WeatherInterface,
} from 'apps/weather_api/src/infrastructure/weather/core/weather.interface';
import { AppConfig } from 'libs/config/app.config';
import { HttpClientService } from 'libs/infrastructure/http/http-client.service';

@Injectable()
export class WeatherApiClient implements WeatherInterface {
  constructor(
    private readonly httpClient: HttpClientService,
    private readonly config: AppConfig,
  ) {}

  async getWeather(city: string): Promise<WeatherData> {
    return await this.httpClient.get<WeatherData>(
      `${this.config.internalApiBaseUrl}/weather/${encodeURIComponent(city)}`,
    );
  }
}
