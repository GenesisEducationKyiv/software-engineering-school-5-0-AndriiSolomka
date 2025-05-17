import { IsNumber, IsString, IsNotEmpty } from 'class-validator';

export class CreateWeatherDto {
  @IsNumber()
  @IsNotEmpty()
  temperature: number;

  @IsNumber()
  @IsNotEmpty()
  humidity: number;

  @IsString()
  @IsNotEmpty()
  description: string;
}
