import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { EmailTransport } from 'src/email/interfaces/email-transport.interface';
import { EmailConfig } from 'src/config/email.config';

@Injectable()
export class NodemailerService implements EmailTransport {
  private transporter: nodemailer.Transporter;

  constructor(private readonly config: EmailConfig) {
    console.log(
      `EmailService initialized with config: ${JSON.stringify(this.config.user)}`,
    );
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
