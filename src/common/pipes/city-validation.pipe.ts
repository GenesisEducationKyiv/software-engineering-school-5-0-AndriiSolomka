import { Injectable, PipeTransform } from '@nestjs/common';
import { SubscriptionParams } from 'src/core/abstracts/subscription/subscription-repository.interface';
import { GeocodingService } from 'src/infrastructure/libs/geocoding/geocoding.service';

@Injectable()
export class CityValidationPipe implements PipeTransform {
  constructor(private readonly geocodingService: GeocodingService) {}

  async transform(value: SubscriptionParams) {
    await this.geocodingService.findCity(value.city);
    return value;
  }
}
