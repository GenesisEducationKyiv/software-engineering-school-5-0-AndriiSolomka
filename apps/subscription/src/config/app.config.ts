import { Configuration, Value } from '@itgorillaz/configify';

@Configuration()
export class AppConfig {
  @Value('PORT', {
    parse: (val: string) => parseInt(val, 10),
    default: 5052,
  })
  port: number;

  @Value('HTTP_PORT', {
    parse: (val: string) => parseInt(val, 10),
    default: 3002,
  })
  httpPort: number;
}
