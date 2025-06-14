import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { IEmailTransport } from 'src/email/interfaces/email-transport.interface';

@Injectable()
export class NodemailerService implements IEmailTransport {
  private transporter: nodemailer.Transporter;
  private readonly sender: string;

  constructor(private readonly config: ConfigService) {
    this.sender = this.config.getOrThrow<string>('EMAIL.SENDER');
    this.transporter = nodemailer.createTransport({
      service: this.config.getOrThrow<string>('EMAIL.SERVICE'),
      auth: {
        user: this.sender,
        pass: this.config.getOrThrow<string>('EMAIL.PASSWORD'),
      },
    });
  }

  async send(mailOptions: { to: string; subject: string; text: string }) {
    await this.transporter.sendMail({
      from: this.sender,
      to: mailOptions.to,
      subject: mailOptions.subject,
      text: mailOptions.text,
    });
  }
}
