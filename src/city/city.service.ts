import { Injectable } from '@nestjs/common';
import { WeatherApiClientService } from 'src/weather-api-client/weather-api-client.service';
import { CacheService } from 'src/cache/cache.service';

@Injectable()
export class CityService {
  constructor(
    private readonly client: WeatherApiClientService,
    private readonly cache: CacheService,
  ) {}

  async checkCityLocations(city: string) {
    const cached = await this.cache.getCity(city);
    if (cached) return cached;
    const location = await this.client.findCity(city);
    await this.cache.setCity(city, location);

    return location;
  }
}
