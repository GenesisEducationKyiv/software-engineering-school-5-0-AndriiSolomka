import { Injectable, Inject } from '@nestjs/common';
import {
  EmailTransport,
  EmailTransportToken,
} from './interfaces/email-transport.interface';
import { EMAIL } from 'src/constants/enums/email/email.enum';
import { IEmailPayload } from 'src/constants/types/email/email.interface';
import { EmailConfig } from 'src/config/email.config';

@Injectable()
export class EmailService {
  constructor(
    @Inject(EmailTransportToken)
    private readonly transport: EmailTransport,
    private readonly config: EmailConfig,
  ) {}

  async sendConfirmationEmail(email: string, token: string): Promise<void> {
    const confirmationUrl = `${this.config.confirmLink}${token}`;
    const subject = EMAIL.SUBJECT;
    const text = `${EMAIL.TEXT} ${confirmationUrl}`;
    await this.transport.send({ to: email, subject, text });
  }

  async sendWeatherEmail(emailPayload: IEmailPayload): Promise<void> {
    await this.transport.send({
      to: emailPayload.email,
      subject: emailPayload.subject,
      text: emailPayload.text,
    });
  }
}
