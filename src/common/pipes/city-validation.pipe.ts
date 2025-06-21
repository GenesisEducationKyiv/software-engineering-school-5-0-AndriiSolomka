import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { GeocodingService } from 'src/geocoding/geocoding.service';
import { CreateSubscriptionDto } from 'src/subscription-handlers/dto/create-subscription.dto';

@Injectable()
export class CityValidationPipe implements PipeTransform {
  constructor(private readonly geocodingService: GeocodingService) {}

  async transform(value: CreateSubscriptionDto) {
    const response = await this.geocodingService.findCity(value.city);
    if (!response.results || response.results.length === 0) {
      throw new NotFoundException(`City "${value.city}" not found`);
    }
    return value;
  }
}
