import { Configuration, Value } from '@itgorillaz/configify';

@Configuration()
export class EmailConfig {
  @Value('EMAIL_UNSUBSCRIBE_LINK')
  unsubscribeLink: string;
}
