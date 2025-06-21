import { Injectable } from '@nestjs/common';
import { CreateWeatherDto } from 'src/weather/dto/create-weather.dto';
import { CacheWeatherService } from 'src/cache-weather/cache-weather.service';
import { WeatherProvider } from 'src/providers/weather/weather.provider';
import { WeatherServiceInterface } from 'src/weather/interfaces/weather.service.interface';

@Injectable()
export class WeatherCacheProxyService implements WeatherServiceInterface {
  constructor(
    private readonly weatherProvider: WeatherProvider,
    private readonly cache: CacheWeatherService,
  ) {}

  async getWeather(city: string): Promise<CreateWeatherDto> {
    const cached = await this.cache.get(city);
    if (cached) return cached;

    const data = await this.weatherProvider.handle(city);
    await this.cache.set(city, data);
    return data;
  }
}
