import { IsEmail, IsEnum, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { Frequency } from 'src/core/entities/subscription.entity';

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

export class ConfirmSubscriptionDto {
  @IsInt()
  @IsNotEmpty()
  subscriptionId: number;
}

export class DeleteSubscriptionDto {
  @IsInt()
  @IsNotEmpty()
  subscriptionId: number;
}

export class GetByFrequencyDto {
  @IsEnum(Frequency)
  frequency: Frequency;
}

export class SubscriptionResponseDto {
  data?: any;
  message?: string;
}
