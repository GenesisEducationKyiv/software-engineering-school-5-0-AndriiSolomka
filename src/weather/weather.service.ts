import { Injectable } from '@nestjs/common';
import { WeatherApiClientService } from '../weather-api-client/weather-api-client.service';
import { CreateWeatherDto } from './dto/create-weather.dto';
import { CacheWeatherService } from 'src/cache-weather/cache-weather.service';

@Injectable()
export class WeatherService {
  constructor(
    private readonly client: WeatherApiClientService,
    private readonly cache: CacheWeatherService,
  ) {}

  async getWeather(city: string): Promise<CreateWeatherDto> {
    const cached = await this.cache.get(city);
    if (cached) return cached;
    const apiResponse = await this.client.getCityWeather(city);

    const {
      temp_c: temperature,
      humidity,
      condition: { text: description },
    } = apiResponse.current;

    const weatherData = { temperature, humidity, description };
    await this.cache.set(city, weatherData);
    return weatherData;
  }
}
