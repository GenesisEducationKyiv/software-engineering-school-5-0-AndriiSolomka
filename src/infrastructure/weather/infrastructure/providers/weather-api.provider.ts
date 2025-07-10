import { Injectable } from '@nestjs/common';
import { ApiConfig } from 'src/config/api.config';
import { WeatherData } from 'src/infrastructure/weather/core/weather.interface';
import { HttpClientService } from 'src/libs/http/http-client.service';

import { WeatherProviderInterface } from '../../core/weather-provider.interface';
import { WeatherApiResponse } from '../../types/weather.interface';

function parseWeatherData(response: WeatherApiResponse): WeatherData {
  return {
    temperature: response.current.temp_c,
    humidity: response.current.humidity,
    description: response.current.condition.text,
  };
}

@Injectable()
export class WeatherApiProviderService implements WeatherProviderInterface {
  constructor(
    private readonly httpService: HttpClientService,
    private readonly config: ApiConfig,
  ) {}

  async getWeather(city: string): Promise<WeatherData> {
    const url = this.buildUrl(city);
    const response = await this.httpService.get<WeatherApiResponse>(url);
    return parseWeatherData(response);
  }

  private buildUrl(city: string): string {
    return `${this.config.weatherApiUrl}/current.json?key=${this.config.weatherApiKey}&q=${city}&aqi=yes`;
  }
}
