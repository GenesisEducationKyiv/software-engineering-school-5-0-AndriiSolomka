import { Inject, Injectable } from '@nestjs/common';
import { EmailConfig } from 'src/config/email.config';
import {
  EmailTransportInterface,
  EmailTransportToken,
} from 'src/core/abstracts/email/email-transport.interface';
import {
  EmailInterface,
  EmailPayload,
} from 'src/core/abstracts/email/email.interface';

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
    const subject = this.config.subject;
    const text = `${this.config.text} ${confirmationUrl}`;
    return { subject, text };
  }
}
