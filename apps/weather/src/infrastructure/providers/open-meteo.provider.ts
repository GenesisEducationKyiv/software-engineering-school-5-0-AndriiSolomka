import { Injectable } from '@nestjs/common';
import { ApiConfig } from 'apps/weather/config/api.config';
import { WeatherData } from 'apps/weather/src/core/weather.interface';
import { Coordinates } from 'libs/core/geocoding/geocoding.interface';
import { GeocodingService } from 'libs/infrastructure/geocoding/geocoding.service';
import { HttpClientService } from 'libs/infrastructure/http/http-client.service';

import { WeatherProviderInterface } from '../../../../../../weather/src/core/weather-provider.interface';
import {
  OpenMeteoResponse,
  openMeteoWeatherCodeMap,
} from '../../types/weather.interface';

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
