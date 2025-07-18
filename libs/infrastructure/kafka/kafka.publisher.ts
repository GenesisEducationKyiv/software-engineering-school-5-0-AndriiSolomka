import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Kafka, Producer } from 'kafkajs';
import { KafkaPublisherConfig } from 'libs/config/kafka.publisher.config';

@Injectable()
export class KafkaPublisherService implements OnModuleInit, OnModuleDestroy {
  private producer: Producer;

  constructor(private readonly config: KafkaPublisherConfig) {}

  async onModuleInit() {
    const kafka = new Kafka({
      clientId: this.config.clientId,
      brokers: [`${this.config.host}:${this.config.port}`],
    });

    this.producer = kafka.producer({ allowAutoTopicCreation: true });
    await this.producer.connect();
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
  }

  async emit(topic: string, message: unknown) {
    await this.producer.send({
      topic,
      messages: [
        {
          value: JSON.stringify(message),
        },
      ],
    });
  }
}
