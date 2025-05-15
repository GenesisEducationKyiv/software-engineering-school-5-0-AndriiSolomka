import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EMAIL } from 'src/constants/enums/email/email.enum';
import { IEmailPayload } from 'src/constants/types/email/email.interface';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: EMAIL.SERVICE,
      auth: {
        user: this.config.get<string>('EMAIL_USER'),
        pass: this.config.get<string>('EMAIL_PASSWORD'),
      },
    });
  }

  private async sendEmail(emailPayload: IEmailPayload): Promise<void> {
    const mailOptions = {
      from: this.config.get<string>('EMAIL_USER'),
      to: emailPayload.email,
      subject: emailPayload.subject,
      text: emailPayload.text,
    };
    await this.transporter.sendMail(mailOptions);
  }

  async sendConfirmationEmail(email: string, token: string): Promise<void> {
    const confirmationUrl = `${EMAIL.CONFIRM_LINK}${token}`;
    const subject = EMAIL.SUBJECT;
    const text = `${EMAIL.TEXT} ${confirmationUrl}`;
    await this.sendEmail({ email, subject, text });
  }

  async sendWeatherEmail(emailPayload: IEmailPayload): Promise<void> {
    await this.sendEmail({
      email: emailPayload.email,
      subject: emailPayload.subject,
      text: emailPayload.text,
    });
  }
}
