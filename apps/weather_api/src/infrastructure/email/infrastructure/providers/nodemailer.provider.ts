import { Injectable } from '@nestjs/common';
import { EmailConfig } from 'apps/weather_api/src/infrastructure/email/config/email.config';
import { EmailTransportInterface } from 'apps/weather_api/src/infrastructure/email/core/email-transport.interface';
import * as nodemailer from 'nodemailer';

@Injectable()
export class NodemailerService implements EmailTransportInterface {
  private transporter: nodemailer.Transporter;

  constructor(private readonly config: EmailConfig) {
    this.transporter = nodemailer.createTransport({
      service: this.config.service,
      auth: {
        user: this.config.user,
        pass: this.config.password,
      },
    });
  }

  async send(mailOptions: { to: string; subject: string; text: string }) {
    await this.transporter.sendMail({
      from: this.config.user,
      to: mailOptions.to,
      subject: mailOptions.subject,
      text: mailOptions.text,
    });
  }
}
