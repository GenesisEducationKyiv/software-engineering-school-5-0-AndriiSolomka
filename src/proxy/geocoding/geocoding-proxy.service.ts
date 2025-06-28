import { CacheCityService } from 'src/cache-city/cache-city.service';
import { GeocodingService } from 'src/geocoding/geocoding.service';
import {
  Coordinates,
  GeocodingInterface,
  GeocodingResponse,
} from 'src/geocoding/interfaces/geocoding.interface';
import { cachedResult } from 'src/utils/cache/cache.utils';

export class GeocodingProxyService implements GeocodingInterface {
  constructor(
    private readonly geocoding: GeocodingService,
    private readonly cache: CacheCityService,
  ) {}

  async findCity(city: string): Promise<GeocodingResponse> {
    return cachedResult(city, this.cache, () => this.geocoding.findCity(city));
  }

  async getCityCoordinates(city: string): Promise<Coordinates> {
    return this.geocoding.getCityCoordinates(city);
  }
}
