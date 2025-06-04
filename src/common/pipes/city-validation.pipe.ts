import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { CityService } from 'src/city/city.service';
import { CreateSubscriptionDto } from 'src/subscription-handlers/dto/create-subscription.dto';

@Injectable()
export class CityValidationPipe implements PipeTransform {
  constructor(private readonly cityService: CityService) {}

  async transform(value: CreateSubscriptionDto) {
    const result = await this.cityService.checkCityLocations(value.city);
    if (!result.length) {
      throw new NotFoundException(`City "${value.city}" not found`);
    }
    return value;
  }
}
