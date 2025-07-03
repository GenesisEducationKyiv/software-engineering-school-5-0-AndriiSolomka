import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsNotEmpty, IsEmail, IsEnum } from 'class-validator';
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

export class UpdateSubscriptionDto extends PartialType(CreateSubscriptionDto) {
  confirmed?: boolean;
}
