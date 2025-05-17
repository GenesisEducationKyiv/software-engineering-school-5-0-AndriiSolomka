import { ApiProperty } from '@nestjs/swagger';
import { Frequency } from '@prisma/client';
import { IsString, IsNotEmpty, IsEmail, IsEnum } from 'class-validator';
import { SUBSCRIPTION_DTO_DOCS } from 'src/constants/documentation/subscribe/dto';

export class CreateSubscriptionDto {
  @ApiProperty(SUBSCRIPTION_DTO_DOCS.email)
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty(SUBSCRIPTION_DTO_DOCS.city)
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty(SUBSCRIPTION_DTO_DOCS.frequency)
  @IsEnum(Frequency)
  frequency: Frequency;
}
