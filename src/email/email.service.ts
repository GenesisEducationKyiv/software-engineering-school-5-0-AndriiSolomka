import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EMAIL } from 'src/constants/enums/email/email.enum';

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

  async sendConfirmationEmail(email: string, token: string) {
    const confirmationUrl = `${EMAIL.CONFIRM_LINK}${token}`;
    const mailOptions = {
      from: this.config.get<string>('EMAIL_USER'),
      to: email,
      subject: EMAIL.SUBJECT,
      text: `${EMAIL.TEXT} ${confirmationUrl}`,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
