import { Injectable } from '@nestjs/common';
import { WeatherApiClientService } from 'src/weather-api-client/weather-api-client.service';
import { CashService } from 'src/cash/cash.service';

@Injectable()
export class CityService {
  constructor(
    private readonly client: WeatherApiClientService,
    private readonly cache: CashService,
  ) {}

  async checkCityLocations(city: string) {
    const cached = await this.cache.getCity(city);
    if (cached) return cached;
    const location = await this.client.findCity(city);
    await this.cache.setCity(city, location);

    return location;
  }
}
