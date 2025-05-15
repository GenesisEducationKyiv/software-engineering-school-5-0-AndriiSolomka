import { Injectable } from '@nestjs/common';
import { WeatherApiClientService } from '../weather-api-client/weather-api-client.service';
import { CreateWeatherDto } from './dto/create-weather.dto';
import { CashService } from 'src/cash/cash.service';

@Injectable()
export class WeatherService {
  constructor(
    private readonly client: WeatherApiClientService,
    private readonly cache: CashService,
  ) {}

  async getWeather(city: string): Promise<CreateWeatherDto> {
    const cached = await this.cache.getWeather(city);
    if (cached) return cached;
    const apiResponse = await this.client.getCityWeather(city);

    const {
      temp_c: temperature,
      humidity,
      condition: { text: description },
    } = apiResponse.current;

    const weatherData = { temperature, humidity, description };
    await this.cache.setWeather(city, weatherData);
    return weatherData;
  }
}
