import { Injectable, PipeTransform } from '@nestjs/common';
import { GeocodingService } from 'src/libs/geocoding/geocoding.service';

@Injectable()
export class CityValidationPipe implements PipeTransform {
  constructor(private readonly geocodingService: GeocodingService) {}

  async transform(value: string) {
    await this.geocodingService.findCity(value);
    return value;
  }
}
