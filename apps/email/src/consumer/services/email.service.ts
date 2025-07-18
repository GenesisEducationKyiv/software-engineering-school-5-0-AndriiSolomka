import { Inject, Injectable } from '@nestjs/common';
import { KafkaConsumer } from 'libs/core/kafka/kafka.interface';

import {
  EmailInterface,
  EmailPayload,
  EmailToken,
} from '../../email/core/email.interface';

@Injectable()
export class EmailKafkaConsumer implements KafkaConsumer<EmailPayload> {
  constructor(
    @Inject(EmailToken)
    private readonly emailService: EmailInterface,
  ) {}

  async handleEvent(payload: EmailPayload): Promise<void> {
    await this.emailService.sendWeatherEmail(payload);
  }
}
