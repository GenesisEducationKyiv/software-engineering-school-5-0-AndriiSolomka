import { CreateWeatherDto } from 'src/weather/dto/create-weather.dto';
import { CacheWeatherService } from 'src/cache-weather/cache-weather.service';
import { WeatherProvider } from 'src/providers/weather/weather.provider';
import { WeatherInterface } from 'src/weather/interfaces/weather.service.interface';
import { cachedResult } from 'src/utils/cache/cache.utils';

export class WeatherCacheProxyService implements WeatherInterface {
  constructor(
    private readonly weatherProvider: WeatherProvider,
    private readonly cache: CacheWeatherService,
  ) {}

  async getWeather(city: string): Promise<CreateWeatherDto> {
    return cachedResult(city, this.cache, () =>
      this.weatherProvider.getWeather(city),
    );
  }
}
