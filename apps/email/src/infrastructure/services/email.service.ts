import { Inject, Injectable } from '@nestjs/common';
import { EmailConfig } from 'apps/email/config/email.config';
import {
  EmailTransportInterface,
  EmailTransportToken,
} from 'apps/email/src/core/email-transport.interface';
import {
  EmailInterface,
  EmailPayload,
} from 'apps/email/src/core/email.interface';
import {
  LoggerInterface,
  LoggerToken,
} from 'libs/core/logger/logger.interface';

enum EMAIL {
  SUBJECT = 'Subscription Confirmation',
  TEXT = 'Please confirm your Subscription by clicking the link:',
}

@Injectable()
export class EmailService implements EmailInterface {
  constructor(
    @Inject(LoggerToken)
    private readonly logger: LoggerInterface,
    @Inject(EmailTransportToken)
    private readonly transport: EmailTransportInterface,
    private readonly config: EmailConfig,
  ) {}

  async sendConfirmationEmail(email: string, token: string): Promise<void> {
    const { subject, text } = this.buildConfirmationEmail(token);

    try {
      await this.transport.send({ to: email, subject, text });

      this.logger.info({
        context: EmailService.name,
        method: 'sendConfirmationEmail',
        status: 'success',
        to: email,
      });
    } catch (error) {
      this.logger.error({
        context: EmailService.name,
        method: 'sendConfirmationEmail',
        status: 'failed',
        to: email,
        error,
      });
      throw error;
    }
  }

  async sendWeatherEmail(emailPayload: EmailPayload): Promise<void> {
    try {
      await this.transport.send({
        to: emailPayload.email,
        subject: emailPayload.subject,
        text: emailPayload.text,
      });

      this.logger.info({
        context: EmailService.name,
        method: 'sendWeatherEmail',
        status: 'success',
        to: emailPayload.email,
      });
    } catch (error) {
      this.logger.error({
        context: EmailService.name,
        method: 'sendWeatherEmail',
        status: 'failed',
        to: emailPayload.email,
        error,
      });
      throw error;
    }
  }

  private buildConfirmationEmail(token: string) {
    const confirmationUrl = `${this.config.confirmLink}${token}`;
    const subject = EMAIL.SUBJECT;
    const text = `${EMAIL.TEXT} ${confirmationUrl}`;
    return { subject, text };
  }
}
