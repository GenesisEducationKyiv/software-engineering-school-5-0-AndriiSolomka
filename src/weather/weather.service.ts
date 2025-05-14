import { Injectable } from '@nestjs/common';
import { WeatherApiClientService } from '../weather-api-client/weather-api-client.service';

export interface WeatherDto {
  temperature: number;
  humidity: number;
  description: string;
}

@Injectable()
export class WeatherService {
  constructor(private readonly client: WeatherApiClientService) {}

  async getWeather(city: string): Promise<WeatherDto> {
    const data = await this.client.getCityWeather(city);
    return {
      temperature: data.current.temp_c,
      humidity: data.current.humidity,
      description: data.current.condition.text,
    };
  }
}
