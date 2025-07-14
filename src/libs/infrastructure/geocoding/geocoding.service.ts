import { Injectable, NotFoundException } from '@nestjs/common';
import { HttpClientService } from 'libs/infrastructure/http/http-client.service';
import {
  City,
  Coordinates,
  GeocodingInterface,
} from 'src/libs/core/geocoding/geocoding.interface';

type GeocodingResponse = {
  results: {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    elevation: number;
    feature_code: string;
    country_code: string;
    admin1_id: number;
    admin2_id: number;
    timezone: string;
    population: number;
    country_id: number;
    country: string;
    admin1: string;
    admin2: string;
  }[];
  generationtime_ms: number;
};

@Injectable()
export class GeocodingService implements GeocodingInterface {
  constructor(
    private readonly httpService: HttpClientService,
    private readonly geocodingUrl: string,
  ) {}

  async findCity(cityName: string): Promise<City> {
    const url = this.buildCityUrl(cityName);
    const response = await this.httpService.get<GeocodingResponse>(url);

    if (!response.results || response.results.length === 0) {
      throw new NotFoundException(`City "${cityName}" not found`);
    }

    const [{ id, name, latitude, longitude, country }] = response.results;
    return { id, name, coordinates: { latitude, longitude }, country };
  }

  async getCityCoordinates(city: string): Promise<Coordinates> {
    const { coordinates } = await this.findCity(city);
    return coordinates;
  }

  private buildCityUrl(city: string): string {
    return `${this.geocodingUrl}/search?name=${city}`;
  }
}
