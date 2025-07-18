import { Consumer, EachMessagePayload, Kafka } from 'kafkajs';
import { KafkaConsumerConfig } from 'libs/config/kafka.config';
import { KAFKA_CONSUMER, KafkaConsumer } from 'libs/core/kafka/kafka.interface';

export function createKafkaConsumerProvider<T>(
  topic: string,
  handlerToken: symbol,
) {
  return {
    provide: KAFKA_CONSUMER,
    useFactory: async (
      config: KafkaConsumerConfig,
      subscriber: KafkaConsumer<T>,
    ): Promise<Consumer> => {
      const kafka = new Kafka({
        clientId: config.clientId,
        brokers: [`${config.host}:${config.port}`],
      });

      const consumer = kafka.consumer({ groupId: config.groupId });
      await consumer.connect();
      await consumer.subscribe({ topic, fromBeginning: false });

      await consumer.run({
        eachMessage: async ({ message }: EachMessagePayload) => {
          if (!message.value) return;
          try {
            const parsed = JSON.parse(message.value.toString()) as T;
            await subscriber.handleEvent(parsed);
          } catch (err) {
            console.error('Kafka consumer error:', err);
          }
        },
      });

      return consumer;
    },
    inject: [KafkaConsumerConfig, handlerToken],
  };
}
