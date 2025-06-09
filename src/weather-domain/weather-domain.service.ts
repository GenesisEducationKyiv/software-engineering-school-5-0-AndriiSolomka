import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ILocation,
  IWeatherApiResponse,
} from '../constants/types/weather/weather-client.interface';
import { FetchService } from '../fetch/fetch.service';
import { WEATHER_API_PATH } from 'src/constants/enums/weather-api/weather-api.enum';

@Injectable()
export class WeatherDomainService {
  private apiKey: string;
  private baseUrl: string;
  constructor(
    private readonly fetch: FetchService,
    private readonly config: ConfigService,
  ) {
    this.apiKey = this.config.get<string>('WEATHER_API_KEY', '');
    this.baseUrl = this.config.get<string>('BASE_WEATHER_URL', '');
  }

  async getCityWeather(city: string): Promise<IWeatherApiResponse> {
    const url = `${this.baseUrl}${WEATHER_API_PATH.CURRENT}?key=${this.apiKey}&q=${city}&aqi=yes`;
    return await this.fetch.get<IWeatherApiResponse>(url);
  }

  async findCity(city: string) {
    const url = `${this.baseUrl}${WEATHER_API_PATH.SEARCH}?key=${this.apiKey}&q=${city}&aqi=yes`;
    return await this.fetch.get<ILocation[]>(url);
  }
}
