import { Inject, Injectable } from '@nestjs/common';
import { EmailConfig } from 'apps/email/config/email.config';
import {
  EmailTransportInterface,
  EmailTransportToken,
} from 'apps/email/src/email/core/email-transport.interface';
import {
  EmailInterface,
  EmailPayload,
} from 'apps/email/src/email/core/email.interface';

enum EMAIL {
  SUBJECT = 'Subscription Confirmation',
  TEXT = 'Please confirm your Subscription by clicking the link:',
}

@Injectable()
export class EmailService implements EmailInterface {
  constructor(
    @Inject(EmailTransportToken)
    private readonly transport: EmailTransportInterface,
    private readonly config: EmailConfig,
  ) {}

  async sendConfirmationEmail(email: string, token: string): Promise<void> {
    const { subject, text } = this.buildConfirmationEmail(token);
    await this.transport.send({ to: email, subject, text });
  }

  async sendWeatherEmail(emailPayload: EmailPayload): Promise<void> {
    await this.transport.send({
      to: emailPayload.email,
      subject: emailPayload.subject,
      text: emailPayload.text,
    });
  }

  private buildConfirmationEmail(token: string) {
    const confirmationUrl = `${this.config.confirmLink}${token}`;
    const subject = EMAIL.SUBJECT;
    const text = `${EMAIL.TEXT} ${confirmationUrl}`;
    return { subject, text };
  }
}
