import { IsNotEmpty, IsString } from 'class-validator';

export class WeatherQueryDto {
  @IsString()
  @IsNotEmpty()
  city: string;
}
