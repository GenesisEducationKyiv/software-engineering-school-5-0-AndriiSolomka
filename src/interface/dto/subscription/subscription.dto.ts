import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
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
