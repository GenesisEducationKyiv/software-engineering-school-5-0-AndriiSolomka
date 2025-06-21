import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';
import { WEATHER_QUERY_DTO_DOCS } from 'src/constants/documentation/weather/dto';

export class WeatherQueryDto {
  @ApiProperty(WEATHER_QUERY_DTO_DOCS.city)
  @IsString()
  @IsNotEmpty()
  city: string;
}
