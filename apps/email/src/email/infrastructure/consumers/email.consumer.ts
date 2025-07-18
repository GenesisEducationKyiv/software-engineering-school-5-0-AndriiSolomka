import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka, EventPattern, Payload } from '@nestjs/microservices';
import { KAFKA_CONSUMER } from 'apps/email/src/kafka/kafka.module';
import { EMAIL_EVENTS } from 'libs/common/events/email';

import { EmailPayload, EmailToken } from '../../core/email.interface';
import { EmailService } from '../services/email.service';

@Injectable()
export class EmailConsumer implements OnModuleInit {
  constructor(
    @Inject(KAFKA_CONSUMER)
    private readonly kafkaConsumer: ClientKafka,
    @Inject(EmailToken)
    private readonly emailService: EmailService,
  ) {}

  async onModuleInit() {
    await this.kafkaConsumer.connect();
  }

  @EventPattern(EMAIL_EVENTS.SENDED)
  async handleEmailSend(@Payload() data: EmailPayload) {
    console.log(`Received email payload: ${JSON.stringify(data)}`);
    await this.emailService.sendWeatherEmail(data);
  }
}
