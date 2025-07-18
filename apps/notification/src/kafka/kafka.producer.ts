import { KafkaConfig } from 'apps/notification/config/kafka.config';
import { Kafka, Producer } from 'kafkajs';

export const KAFKA_PUBLISHER = Symbol('KAFKA_PUBLISHER');

export const kafkaProvider = {
  provide: KAFKA_PUBLISHER,
  useFactory: async (config: KafkaConfig): Promise<Producer> => {
    const kafka = new Kafka({
      clientId: config.clientId,
      brokers: [`${config.host}:${config.port}`],
    });

    const producer = kafka.producer({ allowAutoTopicCreation: true });
    await producer.connect();
    return producer;
  },
  inject: [KafkaConfig],
};
