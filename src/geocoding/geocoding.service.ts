import { Injectable } from '@nestjs/common';
import { FetchService } from 'src/fetch/fetch.service';
import {
  Coordinates,
  GeocodingInterface,
  GeocodingResponse,
} from './interfaces/geocoding.interface';

@Injectable()
export class GeocodingService implements GeocodingInterface {
  constructor(
    private readonly fetch: FetchService,
    private readonly geocodingUrl: string,
  ) {}

  async findCity(city: string): Promise<GeocodingResponse> {
    const url = this.buildCityUrl(city);
    return await this.fetch.get<GeocodingResponse>(url);
  }

  async getCityCoordinates(city: string): Promise<Coordinates> {
    const coordinates = await this.findCity(city);
    const { latitude, longitude } = coordinates.results[0];
    return { latitude, longitude };
  }

  private buildCityUrl(city: string): string {
    return `${this.geocodingUrl}/search?name=${city}`;
  }
}
