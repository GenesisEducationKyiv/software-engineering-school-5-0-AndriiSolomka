import { IsEnum } from 'class-validator';
import { Frequency } from 'src/core/entities/subscription.entity';

export class SendUpdatesDto {
  @IsEnum(Frequency)
  frequency: Frequency;
}
