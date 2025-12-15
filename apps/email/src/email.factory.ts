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
import { MetricsEmailServiceDecorator } from './infrastructure/decorators/metrics-email.decorator';
import { EmailMetrics } from './infrastructure/metrics/email-metrics';
import { EmailService } from './infrastructure/services/email.service';

@Injectable()
export class EmailFactory {
  constructor(
    @Inject(EmailTransportToken)
    private readonly transport: EmailTransportInterface,
    @Inject(LoggerToken)
    private readonly logger: LoggerInterface,
    private readonly config: EmailConfig,
    private readonly metrics: EmailMetrics,
  ) {}

  create() {
    const service = new EmailService(this.logger, this.transport, this.config);
    return new MetricsEmailServiceDecorator(service, this.metrics);
  }
}
