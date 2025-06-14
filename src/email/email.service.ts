import { Injectable, Inject } from '@nestjs/common';
import {
  EmailTransport,
  EmailTransportToken,
} from './interfaces/email-transport.interface';
import { EMAIL } from 'src/constants/enums/email/email.enum';
import { IEmailPayload } from 'src/constants/types/email/email.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private readonly confirmLink: string;

  constructor(
    @Inject(EmailTransportToken)
    private readonly transport: EmailTransport,
    private readonly config: ConfigService,
  ) {
    this.confirmLink = this.config.getOrThrow<string>('EMAIL.CONFIRM_LINK');
  }

  async sendConfirmationEmail(email: string, token: string): Promise<void> {
    const confirmationUrl = `${this.confirmLink}${token}`;
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
