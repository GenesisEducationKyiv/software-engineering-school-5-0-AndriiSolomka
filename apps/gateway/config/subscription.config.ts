import { Configuration, Value } from '@itgorillaz/configify';

@Configuration()
export class SubscriptionConfig {
  @Value('SUBSCRIPTION_HOST', { default: 'localhost' })
  subscriptionHost: string;

  @Value('SUBSCRIPTION_PORT', {
    parse: (val: string) => parseInt(val, 10),
    default: 5052,
  })
  subscriptionPort: number;
}
