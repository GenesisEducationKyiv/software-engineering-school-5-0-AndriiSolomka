import { Injectable, Inject } from '@nestjs/common';
import {
  EmailTransport,
  EmailTransportToken,
} from './interfaces/email-transport.interface';
import { EMAIL } from 'src/constants/enums/email/email.enum';
import { IEmailPayload } from 'src/constants/types/email/email.interface';
import { ConfigType } from '@nestjs/config';
import type { IEmailService } from 'src/email/interfaces/email-service.interface';
import emailConfig from 'src/config/email.config';

@Injectable()
export class EmailService implements IEmailService {
  constructor(
    @Inject(EmailTransportToken)
    private readonly transport: EmailTransport,
    @Inject(emailConfig.KEY)
    private readonly config: ConfigType<typeof emailConfig>,
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
