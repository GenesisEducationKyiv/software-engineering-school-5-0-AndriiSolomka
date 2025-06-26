import { Inject, Injectable } from '@nestjs/common';
import { WeatherProvider } from './weather.provider';
import { CreateWeatherDto } from 'src/weather/dto/create-weather.dto';
import { FetchService } from 'src/fetch/fetch.service';
import { ConfigType } from '@nestjs/config';
import { WeatherApiResponse } from 'src/constants/types/weather/weather-client.interface';
import apiConfig from 'src/config/api.config';

@Injectable()
export class WeatherApiProviderService extends WeatherProvider {
  constructor(
    private readonly fetch: FetchService,
    @Inject(apiConfig.KEY)
    private readonly config: ConfigType<typeof apiConfig>,
  ) {
    super();
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
    const params = new URLSearchParams({
      key: this.config.weatherApiKey,
      q: city,
      aqi: 'yes',
    });
    return `${this.config.weatherApiUrl}/current.json?${params.toString()}`;
  }
}
