import { GeocodingResponse } from 'src/constants/types/weather/weather-client.interface';
import { CacheCityService } from 'src/cache-city/cache-city.service';
import { GeocodingService } from 'src/geocoding/geocoding.service';
import {
  Coordinates,
  GeocodingServiceInterface,
} from 'src/geocoding/interfaces/geocoding.interface';

export class GeocodingProxyService implements GeocodingServiceInterface {
  constructor(
    private readonly geocoding: GeocodingService,
    private readonly cache: CacheCityService,
  ) {}

  async findCity(city: string): Promise<GeocodingResponse> {
    const cached = await this.cache.get(city);
    if (cached) return cached;

    const data = await this.geocoding.findCity(city);
    await this.cache.set(city, data);
    return data;
  }

  async getCityCoordinates(city: string): Promise<Coordinates> {
    return this.geocoding.getCityCoordinates(city);
  }
}
