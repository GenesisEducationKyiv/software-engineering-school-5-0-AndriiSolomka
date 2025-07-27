import {
  EmailInterface,
  EmailPayload,
} from 'apps/email/src/core/email.interface';
import { LoggerInterface } from 'libs/core/logger/logger.interface';
import { LoggingDecoratorBase } from 'libs/infrastructure/logger/logger.abstract';

export class LoggingEmailServiceDecorator
  extends LoggingDecoratorBase<EmailInterface>
  implements EmailInterface
{
  constructor(
    protected readonly wrapped: EmailInterface,
    protected readonly logger: LoggerInterface,
    protected readonly context: string = 'EmailService',
  ) {
    super(wrapped, logger, context);
  }

  async sendConfirmationEmail(email: string, token: string): Promise<void> {
    return this.logAndExecute('sendConfirmationEmail', { email }, () =>
      this.wrapped.sendConfirmationEmail(email, token),
    );
  }

  async sendWeatherEmail(emailPayload: EmailPayload): Promise<void> {
    console.log('Sending weather email:', emailPayload);

    return this.logAndExecute(
      'sendWeatherEmail',
      { email: emailPayload.email },
      () => this.wrapped.sendWeatherEmail(emailPayload),
    );
  }
}
