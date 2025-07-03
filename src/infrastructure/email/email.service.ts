import { Injectable, Inject } from '@nestjs/common';
import { EmailConfig } from 'src/config/email.config';

import { EMAIL } from './constants/email.constants';
import {
  EmailInterface,
  EmailPayload,
} from 'src/core/abstracts/email/email.interface';
import {
  EmailTransportInterface,
  EmailTransportToken,
} from 'src/core/abstracts/email/email-transport.interface';

@Injectable()
export class EmailService implements EmailInterface {
  constructor(
    @Inject(EmailTransportToken)
    private readonly transport: EmailTransportInterface,
    private readonly config: EmailConfig,
  ) {}

  async sendConfirmationEmail(email: string, token: string): Promise<void> {
    const confirmationUrl = `${this.config.confirmLink}${token}`;
    const subject = EMAIL.SUBJECT;
    const text = `${EMAIL.TEXT} ${confirmationUrl}`;
    await this.transport.send({ to: email, subject, text });
  }

  async sendWeatherEmail(emailPayload: EmailPayload): Promise<void> {
    await this.transport.send({
      to: emailPayload.email,
      subject: emailPayload.subject,
      text: emailPayload.text,
    });
  }
}
