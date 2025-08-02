import { LoggerInterface } from 'libs/core/logger/logger.interface';
import { LoggingDecoratorBase } from 'libs/infrastructure/logger/logger.abstract';

import { EmailPublisherInterface } from '../../core/publisher.interface';
import { EmailPublisher } from '../publisher/email.publisher';

export class LoggingEmailPublisherDecorator extends LoggingDecoratorBase<EmailPublisherInterface> {
  constructor(
    protected readonly wrapped: EmailPublisherInterface,
    protected readonly logger: LoggerInterface,
    protected readonly context = EmailPublisher.name,
  ) {
    super(wrapped, logger, context);
  }

  publishEmail(email: string, subject: string, text: string): Promise<void> {
    return this.logAndExecute('publishEmail', { email, subject }, () =>
      Promise.resolve(this.wrapped.publishEmail(email, subject, text)),
    );
  }
}
