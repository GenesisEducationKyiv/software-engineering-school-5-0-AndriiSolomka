import { Configuration, Value } from '@itgorillaz/configify';

@Configuration()
export class EmailConfig {
  @Value('EMAIL_HOST', { default: 'localhost' })
  emailHost: string;

  @Value('EMAIL_PORT', {
    parse: (val: string) => parseInt(val, 10),
    default: 5054,
  })
  emailPort: number;

  @Value('EMAIL_UNSUBSCRIBE_LINK')
  unsubscribeLink: string;
}
