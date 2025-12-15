import { Configuration, Value } from '@itgorillaz/configify';

@Configuration()
export class WeatherConfig {
  @Value('WEATHER_HOST', { default: 'localhost' })
  weatherHost: string;

  @Value('WEATHER_PORT', {
    parse: (val: string) => parseInt(val, 10),
    default: 5052,
  })
  weatherPort: number;
}
