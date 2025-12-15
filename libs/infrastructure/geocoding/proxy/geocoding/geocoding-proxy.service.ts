import {
  City,
  Coordinates,
  GeocodingInterface,
} from 'libs/core/geocoding/geocoding.interface';

import { CacheCityService } from '../../cache/cache-city.service';
import { GeocodingService } from '../../geocoding.service';

export class GeocodingCacheProxyService implements GeocodingInterface {
  constructor(
    private readonly geocoding: GeocodingService,
    private readonly cache: CacheCityService,
  ) {}

  async findCity(city: string): Promise<City> {
    return this.cache.getOrCompute(city, () => this.geocoding.findCity(city));
  }

  async getCityCoordinates(city: string): Promise<Coordinates> {
    return this.geocoding.getCityCoordinates(city);
  }
}
