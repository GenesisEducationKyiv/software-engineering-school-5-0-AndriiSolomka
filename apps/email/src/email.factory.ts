import { Inject, Injectable } from '@nestjs/common';
import { EmailConfig } from 'apps/email/config/email.config';
import {
  LoggerInterface,
  LoggerToken,
} from 'libs/core/logger/logger.interface';

import {
  EmailTransportInterface,
  EmailTransportToken,
} from './core/email-transport.interface';
import { LoggingEmailServiceDecorator } from './infrastructure/decorators/email-logging.decorator';
import { EmailService } from './infrastructure/services/email.service';

@Injectable()
export class EmailFactory {
  constructor(
    @Inject(EmailTransportToken)
    private readonly transport: EmailTransportInterface,
    @Inject(LoggerToken)
    private readonly logger: LoggerInterface,
    private readonly config: EmailConfig,
  ) {}

  create() {
    const original = new EmailService(this.transport, this.config);
    return new LoggingEmailServiceDecorator(original, this.logger);
  }
}
