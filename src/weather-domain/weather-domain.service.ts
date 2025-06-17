import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Location,
  WeatherApiResponse,
} from '../constants/types/weather/weather-client.interface';
import { FetchService } from '../fetch/fetch.service';
import { WEATHER_API_PATH } from 'src/constants/enums/weather-api/weather-api.enum';
import { IWeatherDomainService } from './interfaces/weather-domain.service.interface';

@Injectable()
export class WeatherDomainService implements IWeatherDomainService {
  private apiKey: string;
  private baseUrl: string;
  constructor(
    private readonly fetch: FetchService,
    private readonly config: ConfigService,
  ) {
    this.apiKey = this.config.getOrThrow<string>('WEATHER.API_KEY');
    this.baseUrl = this.config.getOrThrow<string>('WEATHER.BASE_URL');
  }

  async getCityWeather(city: string): Promise<WeatherApiResponse> {
    const url = `${this.baseUrl}${WEATHER_API_PATH.CURRENT}?key=${this.apiKey}&q=${city}&aqi=yes`;
    return await this.fetch.get<WeatherApiResponse>(url);
  }

  async findCity(city: string) {
    const url = `${this.baseUrl}${WEATHER_API_PATH.SEARCH}?key=${this.apiKey}&q=${city}&aqi=yes`;
    return await this.fetch.get<Location[]>(url);
  }
}
