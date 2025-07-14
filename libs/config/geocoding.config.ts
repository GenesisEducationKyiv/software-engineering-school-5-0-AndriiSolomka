import { Configuration, Value } from '@itgorillaz/configify';
import { IsNotEmpty, IsUrl } from 'class-validator';

@Configuration()
export class GeocodingConfig {
  @IsUrl()
  @IsNotEmpty()
  @Value('GEOCODING_API_URL')
  geocodingApiUrl: string;
}
