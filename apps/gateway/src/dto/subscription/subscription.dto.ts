import { Frequency } from 'apps/subscription/src/core/entities/subscription.entity';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateSubscriptionDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsEnum(Frequency)
  frequency: Frequency;
}
