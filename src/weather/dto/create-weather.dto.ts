import { IsNumber, IsString, IsNotEmpty } from 'class-validator';

export class CreateWeatherDto {
  @IsNumber()
  temperature: number;

  @IsNumber()
  humidity: number;

  @IsString()
  @IsNotEmpty()
  description: string;
}
