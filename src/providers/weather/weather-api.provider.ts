import { Injectable } from '@nestjs/common';
import { WeatherProvider } from './weather.provider';
import { CreateWeatherDto } from 'src/weather/dto/create-weather.dto';
import { HttpClientService } from 'src/http-client/http-client.service';
import { WeatherApiResponse } from 'src/constants/types/weather/weather-client.interface';
import { ApiConfig } from 'src/config/api.config';

function parseWeatherData(response: WeatherApiResponse): CreateWeatherDto {
  return {
    temperature: response.current.temp_c,
    humidity: response.current.humidity,
    description: response.current.condition.text,
  };
}

@Injectable()
export class WeatherApiProviderService extends WeatherProvider {
  constructor(
    private readonly httpService: HttpClientService,
    private readonly config: ApiConfig,
  ) {
    super();
  }

  async getWeather(city: string): Promise<CreateWeatherDto> {
    const url = this.buildUrl(city);
    const response = await this.httpService.get<WeatherApiResponse>(url);
    return parseWeatherData(response);
  }

  private buildUrl(city: string): string {
    const params = new URLSearchParams({
      key: this.config.weatherApiKey,
      q: city,
      aqi: 'yes',
    });
    return `${this.config.weatherApiUrl}/current.json?${params.toString()}`;
  }
}
