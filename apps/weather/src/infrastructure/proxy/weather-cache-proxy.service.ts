import {
  WeatherData,
  WeatherInterface,
} from 'apps/weather/src/core/weather.interface';

import { WeatherProviderInterface } from '../../core/weather-provider.interface';
import { CacheWeatherService } from '../cache/cache-weather.service';

export class WeatherCacheProxyService implements WeatherInterface {
  constructor(
    private readonly weatherProvider: WeatherProviderInterface,
    private readonly cache: CacheWeatherService,
  ) {}

  async getWeather(city: string): Promise<WeatherData> {
    return this.cache.getOrCompute(city, () =>
      this.weatherProvider.getWeather(city),
    );
  }
}
