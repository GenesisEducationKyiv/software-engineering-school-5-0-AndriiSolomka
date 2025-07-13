import { Injectable, PipeTransform } from '@nestjs/common';
import { GeocodingService } from 'libs/infrastructure/geocoding/geocoding.service';

export enum Frequency {
  hourly = 'hourly',
  daily = 'daily',
}

export type SubscriptionParams = {
  email: string;
  city: string;
  frequency: Frequency;
};

@Injectable()
export class CityValidationPipe implements PipeTransform {
  constructor(private readonly geocodingService: GeocodingService) {}

  async transform(value: SubscriptionParams) {
    await this.geocodingService.findCity(value.city);
    return value;
  }
}
