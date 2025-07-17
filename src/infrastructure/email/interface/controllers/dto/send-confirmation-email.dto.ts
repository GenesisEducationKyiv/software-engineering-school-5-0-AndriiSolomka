import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SendConfirmationEmailDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  token: string;
}
