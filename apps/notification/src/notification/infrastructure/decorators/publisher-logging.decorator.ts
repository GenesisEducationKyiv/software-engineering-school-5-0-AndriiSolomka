import { LoggerInterface } from 'libs/core/logger/logger.interface';
import { LoggingDecoratorBase } from 'libs/infrastructure/logger/logger.abstract';

import { EmailPublisher } from '../publisher/email.publisher';

export class LoggingEmailPublisherDecorator extends LoggingDecoratorBase<EmailPublisher> {
  constructor(
    protected readonly wrapped: EmailPublisher,
    protected readonly logger: LoggerInterface,
    protected readonly context = 'EmailPublisher',
  ) {
    super(wrapped, logger, context);
  }

  publishEmail(email: string, subject: string, text: string): Promise<void> {
    return this.logAndExecute('publishEmail', { email, subject }, () =>
      Promise.resolve(this.wrapped.publishEmail(email, subject, text)),
    );
  }
}
