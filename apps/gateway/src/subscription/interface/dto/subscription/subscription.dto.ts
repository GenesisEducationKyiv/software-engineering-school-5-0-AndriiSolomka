import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

import { Frequency } from '../../../core/subscription.interface';

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
