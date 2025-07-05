import { Injectable } from '@nestjs/common';
import { HttpClientService } from 'src/http-client/http-client.service';
import {
  Coordinates,
  GeocodingInterface,
  GeocodingResponse,
} from './interfaces/geocoding.interface';

@Injectable()
export class GeocodingService implements GeocodingInterface {
  constructor(
    private readonly httpService: HttpClientService,
    private readonly geocodingUrl: string,
  ) {}

  async findCity(city: string): Promise<GeocodingResponse> {
    const url = this.buildCityUrl(city);
    return await this.httpService.get<GeocodingResponse>(url);
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
