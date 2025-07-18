import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { KAFKA_PUBLISHER } from 'apps/notification/src/kafka/kafka.producer';
import { Producer } from 'kafkajs';
import { EMAIL_EVENTS } from 'libs/common/events/email';

@Injectable()
export class EmailPublisher implements OnModuleDestroy {
  constructor(
    @Inject(KAFKA_PUBLISHER)
    private readonly kafkaProducer: Producer,
  ) {}

  async onModuleDestroy() {
    await this.kafkaProducer.disconnect();
  }

  async publishEmail(email: string, subject: string, text: string) {
    console.log(`Publishing email to Kafka: ${email}, subject: ${subject}`);

    await this.kafkaProducer.send({
      topic: EMAIL_EVENTS.SENDED,
      messages: [
        {
          key: email,
          value: JSON.stringify({ email, subject, text }),
        },
      ],
    });
  }
}
