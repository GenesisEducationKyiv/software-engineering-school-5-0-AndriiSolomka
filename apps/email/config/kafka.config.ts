import { Configuration, Value } from '@itgorillaz/configify';

@Configuration()
export class KafkaConfig {
  @Value('KAFKA_HOST', { default: 'localhost' })
  host: string;

  @Value('KAFKA_PORT', {
    parse: (val: string) => parseInt(val, 10),
    default: 9092,
  })
  port: number;

  @Value('KAFKA_CLIENT_ID', {
    default: 'email-consumer',
  })
  clientId: string;

  @Value('KAFKA_GROUP_ID', {
    default: 'email-group',
  })
  groupId: string;
}
