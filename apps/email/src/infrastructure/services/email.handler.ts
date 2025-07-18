import { Inject, Injectable } from '@nestjs/common';
import { KafkaConsumer } from 'libs/core/kafka/kafka.interface';

import { EmailService } from './email.service';
import { EmailPayload, EmailToken } from '../../core/email.interface';

@Injectable()
export class EmailKafkaConsumer implements KafkaConsumer<EmailPayload> {
  constructor(
    @Inject(EmailToken)
    private readonly emailService: EmailService,
  ) {}

  async handleEvent(payload: EmailPayload): Promise<void> {
    await this.emailService.sendWeatherEmail(payload);
  }
}
