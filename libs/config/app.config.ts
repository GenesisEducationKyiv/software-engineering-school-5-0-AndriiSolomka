import { Configuration, Value } from '@itgorillaz/configify';

@Configuration()
export class AppConfig {
  @Value('PORT', {
    parse: (val: string) => parseInt(val, 10),
    default: 3000,
  })
  port: number;

  @Value('INTERNAL_API_BASE_URL', {
    default: 'http://localhost:3000/api/internal',
  })
  internalApiBaseUrl: string;
}
