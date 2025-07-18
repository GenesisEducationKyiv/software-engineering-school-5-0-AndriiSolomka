import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { KAFKA_PUBLISHER } from 'apps/notification/src/kafka/kafka.module';
import { EMAIL_EVENTS } from 'libs/common/events/email';

@Injectable()
export class EmailPublisher implements OnModuleInit {
  constructor(
    @Inject(KAFKA_PUBLISHER)
    private readonly kafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    await this.kafkaClient.connect();
  }

  publishEmail(email: string, subject: string, text: string) {
    this.kafkaClient.emit(EMAIL_EVENTS.SENDED, { email, subject, text });
  }
}
