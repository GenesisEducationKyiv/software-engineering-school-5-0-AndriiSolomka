import { Injectable } from '@nestjs/common';
import { WeatherProvider } from './weather.provider';
import { CreateWeatherDto } from 'src/weather/dto/create-weather.dto';
import { FetchService } from 'src/fetch/fetch.service';
import { ConfigService } from '@nestjs/config';
import { WeatherApiResponse } from 'src/constants/types/weather/weather-client.interface';

@Injectable()
export class WeatherApiProviderService extends WeatherProvider {
  private apiKey: string;
  private baseUrl: string;
  constructor(
    private readonly fetch: FetchService,
    private readonly config: ConfigService,
  ) {
    super();
    this.apiKey = this.config.getOrThrow<string>('WEATHER.API_KEY');
    this.baseUrl = this.config.getOrThrow<string>('WEATHER.BASE_URL');
  }

  async getWeather(city: string): Promise<CreateWeatherDto> {
    const url = this.buildUrl(city);
    const response = await this.fetch.get<WeatherApiResponse>(url);
    return this.parseWeatherData(response);
  }

  private parseWeatherData(response: WeatherApiResponse): CreateWeatherDto {
    return {
      temperature: response.current.temp_c,
      humidity: response.current.humidity,
      description: response.current.condition.text,
    };
  }

  private buildUrl(city: string): string {
    return `${this.baseUrl}/current.json?key=${this.apiKey}&q=${city}&aqi=yes`;
  }
}
