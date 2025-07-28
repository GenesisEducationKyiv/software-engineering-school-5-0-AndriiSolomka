import { Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { EMAIL_EVENTS } from 'libs/common/events/email';

import { EmailPublisherInterface } from '../../core/publisher.interface';

@Injectable()
export class EmailPublisher implements OnModuleInit, EmailPublisherInterface {
  constructor(private readonly kafkaClient: ClientKafka) {}

  async onModuleInit() {
    await this.kafkaClient.connect();
  }

  publishEmail(email: string, subject: string, text: string) {
    this.kafkaClient.emit(EMAIL_EVENTS.SENT, { email, subject, text });
  }
}
