import { Injectable } from '@nestjs/common';
import { WeatherProvider } from './weather.provider';
import { CreateWeatherDto } from 'src/weather/dto/create-weather.dto';
import { HttpClientService } from 'src/http-client/http-client.service';
import {
  openMeteoWeatherCodeMap,
  OpenMeteoResponse,
} from 'src/constants/types/weather/weather-client.interface';
import { GeocodingService } from 'src/geocoding/geocoding.service';
import { ApiConfig } from 'src/config/api.config';
import { Coordinates } from 'src/geocoding/interfaces/geocoding.interface';

const OPEN_METEO_CURRENT_WEATHER_FIELDS = [
  'temperature_2m',
  'relative_humidity_2m',
  'weather_code',
];

function getWeatherDescription(weatherCode: number): string {
  return openMeteoWeatherCodeMap[weatherCode] ?? 'Unknown weather condition';
}

function parseWeatherData(response: OpenMeteoResponse): CreateWeatherDto {
  return {
    temperature: response.current.temperature_2m,
    humidity: response.current.relative_humidity_2m,
    description: getWeatherDescription(response.current.weather_code),
  };
}

@Injectable()
export class OpenMeteoProviderService implements WeatherProvider {
  constructor(
    private readonly httpService: HttpClientService,
    private readonly config: ApiConfig,
    private readonly cityService: GeocodingService,
  ) {}

  async getWeather(city: string): Promise<CreateWeatherDto> {
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
