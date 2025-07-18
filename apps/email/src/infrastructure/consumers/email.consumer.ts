import { Inject, Injectable } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { EMAIL_EVENTS } from 'libs/common/events/email';

import { EmailPayload, EmailToken } from '../../core/email.interface';
import { EmailService } from '../services/email.service';

@Injectable()
export class EmailConsumer {
  constructor(
    @Inject(EmailToken)
    private readonly emailService: EmailService,
  ) {}

  @EventPattern(EMAIL_EVENTS.SENDED)
  async handleEmailSend(@Payload() data: EmailPayload) {
    console.log(`Received email payload: ${JSON.stringify(data)}`);
    await this.emailService.sendWeatherEmail(data);
  }
}
