import { WeatherProviderInterface } from 'src/infrastructure/weather/core/weather-provider.interface';
import {
  WeatherData,
  WeatherInterface,
} from 'src/infrastructure/weather/core/weather.interface';
import { CacheWeatherService } from 'src/infrastructure/weather/infrastructure/cache/cache-weather.service';

export class WeatherCacheProxyService implements WeatherInterface {
  constructor(
    private readonly weatherProvider: WeatherProviderInterface,
    private readonly cache: CacheWeatherService,
  ) {}

  async getWeather(city: string): Promise<WeatherData> {
    return this.cache.getOrSet(city, () =>
      this.weatherProvider.getWeather(city),
    );
  }
}
