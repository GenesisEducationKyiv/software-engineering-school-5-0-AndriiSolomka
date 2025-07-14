import {
  City,
  Coordinates,
  GeocodingInterface,
} from 'src/libs/core/geocoding/geocoding.interface';
import { CacheCityService } from 'src/libs/infrastructure/geocoding/cache/cache-city.service';
import { GeocodingService } from 'src/libs/infrastructure/geocoding/geocoding.service';

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
