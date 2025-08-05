import { Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { EMAIL_EVENTS } from 'libs/common/events/email';
import { LoggerInterface } from 'libs/core/logger/logger.interface';

import { EmailPublisherInterface } from '../../core/publisher.interface';

@Injectable()
export class EmailPublisher implements OnModuleInit, EmailPublisherInterface {
  constructor(
    private readonly logger: LoggerInterface,
    private readonly kafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    await this.kafkaClient.connect();
  }

  publishEmail(email: string, subject: string, text: string) {
    try {
      this.kafkaClient.emit(EMAIL_EVENTS.SENT, { email, subject, text });

      this.logger.info({
        context: EmailPublisher.name,
        method: 'publishEmail',
        status: 'emitted',
        to: email,
        subject,
      });
    } catch (error) {
      this.logger.error({
        context: EmailPublisher.name,
        method: 'publishEmail',
        status: 'failed',
        to: email,
        subject,
        error,
      });
      throw error;
    }
  }
}
