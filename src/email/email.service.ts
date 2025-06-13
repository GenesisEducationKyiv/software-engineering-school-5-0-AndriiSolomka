import { Injectable, Inject } from '@nestjs/common';
import {
  IEmailTransport,
  IEmailTransportToken,
} from './interfaces/email-transport.interface';
import { EMAIL } from 'src/constants/enums/email/email.enum';
import { IEmailPayload } from 'src/constants/types/email/email.interface';

@Injectable()
export class EmailService {
  constructor(
    @Inject(IEmailTransportToken)
    private readonly transport: IEmailTransport,
  ) {}

  async sendConfirmationEmail(email: string, token: string): Promise<void> {
    const confirmationUrl = `${EMAIL.CONFIRM_LINK}${token}`;
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
