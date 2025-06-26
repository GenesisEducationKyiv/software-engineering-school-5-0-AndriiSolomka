import { Configuration, Value } from '@itgorillaz/configify';

@Configuration()
export class AppConfig {
  @Value('PORT', {
    parse: (val: string) => parseInt(val, 10),
    default: 3000,
  })
  port: number;
}
