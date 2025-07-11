import { Configuration, Value } from '@itgorillaz/configify';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

@Configuration()
export class ApiConfig {
  @IsString()
  @IsNotEmpty()
  @Value('WEATHER_API_KEY')
  weatherApiKey: string;

  @IsUrl()
  @IsNotEmpty()
  @Value('WEATHER_API_URL')
  weatherApiUrl: string;

  @IsUrl()
  @IsNotEmpty()
  @Value('OPEN_METEO_API_URL')
  openMeteoApiUrl: string;
}
