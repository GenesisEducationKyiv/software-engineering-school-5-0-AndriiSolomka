import { Inject, Injectable } from '@nestjs/common';
import {
  LoggerInterface,
  LoggerToken,
} from 'libs/core/logger/logger.interface';

import {
  SubscriptionRepositoryInterface,
  SubscriptionRepositoryToken,
} from '../../core/subscription/subscription-repository.interface';
import { MetricsSubscriptionRepositoryDecorator } from '../decorators/metrics-subscription.decorator';
import { LoggingSubscriptionServiceDecorator } from '../decorators/subscription-logging.decorator';
import { LoggingSubscriptionRepositoryDecorator } from '../decorators/subsription.prisma.decorator';
import { SubscriptionMetrics } from '../metrics/subscription-metrics';
import { SubscriptionService } from '../services/subscription.service';

@Injectable()
export class SubscriptionFactory {
  constructor(
    @Inject(SubscriptionRepositoryToken)
    private readonly repo: SubscriptionRepositoryInterface,
    @Inject(LoggerToken)
    private readonly logger: LoggerInterface,
    private readonly metrics: SubscriptionMetrics,
  ) {}

  create() {
    const metricsRepo = new MetricsSubscriptionRepositoryDecorator(
      this.repo,
      this.metrics,
    );
    const loggedRepo = new LoggingSubscriptionRepositoryDecorator(
      metricsRepo,
      this.logger,
    );

    return new LoggingSubscriptionServiceDecorator(
      new SubscriptionService(loggedRepo),
      this.logger,
    );
  }
}
