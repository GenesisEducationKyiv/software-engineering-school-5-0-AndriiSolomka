import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Frequency } from 'src/core/entities/subscription.entity';

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
