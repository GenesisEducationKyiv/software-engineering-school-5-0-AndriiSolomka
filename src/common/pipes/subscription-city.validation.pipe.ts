import { Injectable, PipeTransform } from '@nestjs/common';
import { SubscriptionParams } from 'src/infrastructure/subscription-management/core/subscription/subscription-repository.interface';
import { GeocodingService } from 'src/libs/infrastructure/geocoding/geocoding.service';

@Injectable()
export class SubscriptionCityValidationPipe implements PipeTransform {
  constructor(private readonly geocodingService: GeocodingService) {}

  async transform(value: SubscriptionParams) {
    await this.geocodingService.findCity(value.city);
    return value;
  }
}
