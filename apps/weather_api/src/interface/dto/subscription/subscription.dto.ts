import { Frequency } from 'apps/weather_api/src/infrastructure/subscription-management/core/entities/subscription.entity';
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
