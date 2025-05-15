import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WeatherApiResponse } from '../constants/types/weather.interface';
import { FetchService } from '../fetch/fetch.service';
import { WEATHER_API } from 'src/constants/enums/weather-api/weather-api.enum';

@Injectable()
export class WeatherApiClientService {
  private apiKey: string;
  private baseUrl: string;
  constructor(
    private readonly fetch: FetchService,
    private readonly config: ConfigService,
  ) {
    this.apiKey = this.config.get<string>('WEATHER_API_KEY', '');
    this.baseUrl = this.config.get<string>('BASE_WEATHER_URL', '');
  }

  async getCityWeather(city: string): Promise<WeatherApiResponse> {
    const url = `${this.baseUrl}${WEATHER_API.PATH}?key=${this.apiKey}&q=${city}&aqi=yes`;
    return await this.fetch.get<WeatherApiResponse>(url);
  }
}
