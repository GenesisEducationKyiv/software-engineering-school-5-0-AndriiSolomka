import { Injectable } from '@nestjs/common';
import { ApiConfig } from 'src/config/api.config';
import { Coordinates } from 'src/core/abstracts/geocoding/geocoding.interface';
import { WeatherProviderInterface } from 'src/core/abstracts/weather/weather-provider.interface';
import { WeatherData } from 'src/core/abstracts/weather/weather.interface';
import { HttpClientService } from 'src/infrastructure/libs/http/http-client.service';

import {
  OpenMeteoResponse,
  openMeteoWeatherCodeMap,
} from '../types/weather.interface';
import { GeocodingService } from 'src/infrastructure/libs/geocoding/geocoding.service';

const OPEN_METEO_CURRENT_WEATHER_FIELDS = [
  'temperature_2m',
  'relative_humidity_2m',
  'weather_code',
];

function getWeatherDescription(weatherCode: number): string {
  return openMeteoWeatherCodeMap[weatherCode] ?? 'Unknown weather condition';
}

function parseWeatherData(response: OpenMeteoResponse): WeatherData {
  return {
    temperature: response.current.temperature_2m,
    humidity: response.current.relative_humidity_2m,
    description: getWeatherDescription(response.current.weather_code),
  };
}

@Injectable()
export class OpenMeteoProviderService implements WeatherProviderInterface {
  constructor(
    private readonly httpService: HttpClientService,
    private readonly config: ApiConfig,
    private readonly cityService: GeocodingService,
  ) {}

  async getWeather(city: string): Promise<WeatherData> {
    const coordinates = await this.cityService.getCityCoordinates(city);
    const url = this.buildUrl(coordinates);
    const response = await this.httpService.get<OpenMeteoResponse>(url);
    return parseWeatherData(response);
  }

  private buildUrl({ latitude, longitude }: Coordinates): string {
    const currentFields = OPEN_METEO_CURRENT_WEATHER_FIELDS.join(',');
    return `${this.config.openMeteoApiUrl}/forecast?latitude=${latitude}&longitude=${longitude}&current=${currentFields}`;
  }
}
