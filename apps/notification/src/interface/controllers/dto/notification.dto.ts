import { Frequency } from 'apps/subscription/src/core/entities/subscription.entity';
import { IsEnum } from 'class-validator';

export class SendUpdatesDto {
  @IsEnum(Frequency)
  frequency: Frequency;
}
