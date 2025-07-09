import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { EmailConfig } from 'src/config/email.config';
import { EmailTransportInterface } from 'src/core/abstracts/email/email-transport.interface';

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
