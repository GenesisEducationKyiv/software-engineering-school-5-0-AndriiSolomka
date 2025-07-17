import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SendWeatherEmailDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  text: string;
}
