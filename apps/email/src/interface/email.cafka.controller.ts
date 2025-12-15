import { Controller, Inject } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { EMAIL_EVENTS } from 'libs/common/events/email';

import {
  EmailInterface,
  EmailPayload,
  EmailToken,
} from '../core/email.interface';

@Controller()
export class EmailKafkaController {
  constructor(
    @Inject(EmailToken)
    private readonly emailService: EmailInterface,
  ) {}

  @EventPattern(EMAIL_EVENTS.SENT)
  async handleEmailSend(@Payload() data: EmailPayload) {
    await this.emailService.sendWeatherEmail(data);
  }
}
