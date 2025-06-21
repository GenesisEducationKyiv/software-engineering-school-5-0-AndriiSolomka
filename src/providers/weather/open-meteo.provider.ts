import { Injectable } from '@nestjs/common';
import { WeatherProvider } from './weather.provider';
import { CreateWeatherDto } from 'src/weather/dto/create-weather.dto';
import { FetchService } from 'src/fetch/fetch.service';
import { ConfigService } from '@nestjs/config';
import {
  openMeteoWeatherCodeMap,
  OpenMeteoResponse,
} from 'src/constants/types/weather/weather-client.interface';
import { GeocodingService } from 'src/geocoding/geocoding.service';

const CURRENT_FIELDS = [
  'temperature_2m',
  'relative_humidity_2m',
  'weather_code',
];

@Injectable()
export class OpenMeteoProviderService extends WeatherProvider {
  private baseWeatherUrl: string;
  constructor(
    private readonly fetch: FetchService,
    private readonly config: ConfigService,
    private readonly cityService: GeocodingService,
  ) {
    super();
    this.baseWeatherUrl = this.config.getOrThrow<string>('OPEN_METEO.BASE_URL');
  }

  async getWeather(city: string): Promise<CreateWeatherDto> {
    const coordinates = await this.cityService.getCityCoordinates(city);
    const url = this.buildUrl(coordinates.latitude, coordinates.longitude);
    const response = await this.fetch.get<OpenMeteoResponse>(url);
    return this.parseWeatherData(response);
  }

  private getWeatherDescription(weatherCode: number): string {
    return openMeteoWeatherCodeMap[weatherCode] ?? 'Unknown weather condition';
  }

  private parseWeatherData(response: OpenMeteoResponse): CreateWeatherDto {
    return {
      temperature: response.current.temperature_2m,
      humidity: response.current.relative_humidity_2m,
      description: this.getWeatherDescription(response.current.weather_code),
    };
  }

  private buildUrl(latitude: number, longitude: number): string {
    const currentParams = CURRENT_FIELDS.join(',');
    return `${this.baseWeatherUrl}/forecast?latitude=${latitude}&longitude=${longitude}&current=${currentParams}`;
  }
}
