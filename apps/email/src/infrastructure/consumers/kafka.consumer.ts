import { KafkaConfig } from 'apps/email/config/kafka.config';
import { Consumer, EachMessagePayload, Kafka } from 'kafkajs';
import { EMAIL_EVENTS } from 'libs/common/events/email';

import {
  EmailInterface,
  EmailPayload,
  EmailToken,
} from '../../core/email.interface';

export const KAFKA_CONSUMER = Symbol('KAFKA_CONSUMER');

export const kafkaConsumerProvider = {
  provide: KAFKA_CONSUMER,
  useFactory: async (
    config: KafkaConfig,
    emailService: EmailInterface,
  ): Promise<Consumer> => {
    const kafka = new Kafka({
      clientId: config.clientId,
      brokers: [`${config.host}:${config.port}`],
    });

    const consumer: Consumer = kafka.consumer({
      groupId: config.groupId,
    });

    await consumer.connect();

    await consumer.subscribe({
      topic: EMAIL_EVENTS.SENDED,
      fromBeginning: false,
    });

    await consumer.run({
      eachMessage: async ({ message }: EachMessagePayload): Promise<void> => {
        if (!message.value) return;

        try {
          const payload: unknown = JSON.parse(message.value.toString());
          console.log('Kafka message received:', payload);

          const typedPayload = payload as EmailPayload;

          await emailService.sendWeatherEmail(typedPayload);
        } catch (err) {
          console.error('Failed to process Kafka message:', err);
        }
      },
    });

    console.log('Kafka consumer connected and running');
    return consumer;
  },
  inject: [KafkaConfig, EmailToken],
};
