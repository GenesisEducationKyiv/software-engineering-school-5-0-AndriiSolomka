import { Inject, Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigType } from '@nestjs/config';
import { EmailTransport } from 'src/email/interfaces/email-transport.interface';
import emailConfig from 'src/config/email.config';

@Injectable()
export class NodemailerService implements EmailTransport {
  private transporter: nodemailer.Transporter;

  constructor(
    @Inject(emailConfig.KEY)
    private readonly config: ConfigType<typeof emailConfig>,
  ) {
    this.transporter = nodemailer.createTransport({
      service: this.config.service,
      auth: {
        user: this.config.sender,
        pass: this.config.password,
      },
    });
  }

  async send(mailOptions: { to: string; subject: string; text: string }) {
    await this.transporter.sendMail({
      from: this.config.sender,
      to: mailOptions.to,
      subject: mailOptions.subject,
      text: mailOptions.text,
    });
  }
}
