import { Injectable } from '@nestjs/common';
import { WeatherApiClientService } from 'src/weather-api-client/weather-api-client.service';
import { ILocation } from 'src/constants/types/weather/weather-client.interface';
import { CacheCityService } from 'src/cache-city/cache-city.service';

@Injectable()
export class CityService {
  constructor(
    private readonly client: WeatherApiClientService,
    private readonly cache: CacheCityService,
  ) {}

  async checkCityLocations(city: string): Promise<ILocation[]> {
    const cached = await this.cache.get(city);
    if (cached) return cached;
    const location = await this.client.findCity(city);
    await this.cache.set(city, location);

    return location;
  }
}
