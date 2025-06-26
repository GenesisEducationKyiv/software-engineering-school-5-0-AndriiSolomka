import { Inject, Injectable } from '@nestjs/common';
import { WeatherProvider } from './weather.provider';
import { CreateWeatherDto } from 'src/weather/dto/create-weather.dto';
import { FetchService } from 'src/fetch/fetch.service';
import { ConfigType } from '@nestjs/config';
import {
  openMeteoWeatherCodeMap,
  OpenMeteoResponse,
} from 'src/constants/types/weather/weather-client.interface';
import { GeocodingService } from 'src/geocoding/geocoding.service';
import apiConfig from 'src/config/api.config';

const CURRENT_FIELDS = [
  'temperature_2m',
  'relative_humidity_2m',
  'weather_code',
];

@Injectable()
export class OpenMeteoProviderService extends WeatherProvider {
  constructor(
    private readonly fetch: FetchService,
    @Inject(apiConfig.KEY)
    private readonly baseWeatherUrl: ConfigType<typeof apiConfig>,
    private readonly cityService: GeocodingService,
  ) {
    super();
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
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      current: CURRENT_FIELDS.join(','),
    });
    return `${this.baseWeatherUrl.openMeteoApiUrl}/forecast?${params.toString()}`;
  }
}
