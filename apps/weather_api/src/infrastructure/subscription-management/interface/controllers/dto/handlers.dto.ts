import { Frequency } from 'apps/weather_api/src/infrastructure/subscription-management/core/entities/subscription.entity';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class SubscriptionCreateDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsEnum(Frequency)
  @IsNotEmpty()
  frequency: Frequency;
}

export class TokenParamDto {
  @IsString()
  @IsNotEmpty()
  token: string;
}

export class SuccessResponseDto {
  message: string;
}
