import { WeatherProviderInterface } from 'src/core/abstracts/weather/weather-provider.interface';
import {
  WeatherData,
  WeatherInterface,
} from 'src/core/abstracts/weather/weather.interface';
import { CacheWeatherService } from 'src/infrastructure/cache/cache-weather.service';
import { cachedResult } from 'src/utils/cache/cache.utils';

export class WeatherCacheProxyService implements WeatherInterface {
  constructor(
    private readonly weatherProvider: WeatherProviderInterface,
    private readonly cache: CacheWeatherService,
  ) {}

  async getWeather(city: string): Promise<WeatherData> {
    return cachedResult(city, this.cache, () =>
      this.weatherProvider.getWeather(city),
    );
  }
}
