import { Injectable } from '@nestjs/common';
import { WeatherApiClientService } from '../weather-api-client/weather-api-client.service';
import { WeatherCacheService } from './weather-cache.service';
import { CreateWeatherDto } from './dto/create-weather.dto';

@Injectable()
export class WeatherService {
  constructor(
    private readonly client: WeatherApiClientService,
    private readonly cache: WeatherCacheService,
  ) {}

  async getWeather(city: string): Promise<CreateWeatherDto> {
    const cached = await this.cache.get(city);
    if (cached) return cached;

    const data = await this.client.getCityWeather(city);

    const {
      temp_c: temperature,
      humidity,
      condition: { text: description },
    } = data.current;

    const result = { temperature, humidity, description };

    await this.cache.set(city, result);
    return result;
  }
}
