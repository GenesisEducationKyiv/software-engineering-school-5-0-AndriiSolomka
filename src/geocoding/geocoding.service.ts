import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FetchService } from 'src/fetch/fetch.service';
import { GeocodingResponse } from 'src/constants/types/weather/weather-client.interface';
import {
  Coordinates,
  GeocodingServiceInterface,
} from './interfaces/geocoding.interface';

@Injectable()
export class GeocodingService implements GeocodingServiceInterface {
  private readonly geocodingUrl: string;

  constructor(
    private readonly fetch: FetchService,
    private readonly config: ConfigService,
  ) {
    this.geocodingUrl = this.config.getOrThrow<string>('GEOCODING_API_URL');
  }

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
