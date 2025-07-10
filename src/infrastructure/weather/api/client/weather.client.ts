import { Injectable } from '@nestjs/common';
import { AppConfig } from 'src/config/app.config';
import {
  WeatherData,
  WeatherInterface,
} from 'src/core/abstracts/weather/weather.interface';
import { HttpClientService } from 'src/infrastructure/libs/http/http-client.service';

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
