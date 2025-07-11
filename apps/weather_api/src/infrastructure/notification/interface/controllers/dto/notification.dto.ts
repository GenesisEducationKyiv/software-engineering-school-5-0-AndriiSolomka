import { Frequency } from 'apps/weather_api/src/infrastructure/subscription-management/core/entities/subscription.entity';
import { IsEnum } from 'class-validator';

export class SendUpdatesDto {
  @IsEnum(Frequency)
  frequency: Frequency;
}
