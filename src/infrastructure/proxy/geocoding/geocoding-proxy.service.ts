import {
  City,
  Coordinates,
  GeocodingInterface,
} from 'src/core/abstracts/geocoding/geocoding.interface';
import { CacheCityService } from 'src/infrastructure/cache/cache-city.service';
import { GeocodingService } from 'src/infrastructure/geocoding/geocoding.service';

export class GeocodingCacheProxyService implements GeocodingInterface {
  constructor(
    private readonly geocoding: GeocodingService,
    private readonly cache: CacheCityService,
  ) {}

  async findCity(city: string): Promise<City> {
    return this.cache.getOrSet(city, () => this.geocoding.findCity(city));
  }

  async getCityCoordinates(city: string): Promise<Coordinates> {
    return this.geocoding.getCityCoordinates(city);
  }
}
