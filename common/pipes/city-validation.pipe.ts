import { Injectable, PipeTransform } from '@nestjs/common';
import { SubscriptionParams } from 'apps/weather_api/src/infrastructure/subscription-management/core/subscription/subscription-repository.interface';
import { GeocodingService } from 'libs/infrastructure/geocoding/geocoding.service';

@Injectable()
export class WeatherCityValidationPipe implements PipeTransform {
  constructor(private readonly geocodingService: GeocodingService) {}

  async transform(value: string) {
    await this.geocodingService.findCity(value);
    return value;
  }
}

@Injectable()
export class SubscriptionCityValidationPipe implements PipeTransform {
  constructor(private readonly geocodingService: GeocodingService) {}

  async transform(value: SubscriptionParams) {
    await this.geocodingService.findCity(value.city);
    return value;
  }
}
