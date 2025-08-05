import { Inject, Injectable } from '@nestjs/common';

import {
  SubscriptionRepositoryInterface,
  SubscriptionRepositoryToken,
} from '../../core/subscription/subscription-repository.interface';
import { MetricsSubscriptionRepositoryDecorator } from '../decorators/metrics-subscription.decorator';
import { SubscriptionMetrics } from '../metrics/subscription-metrics';
import { SubscriptionService } from '../services/subscription.service';

@Injectable()
export class SubscriptionFactory {
  constructor(
    @Inject(SubscriptionRepositoryToken)
    private readonly repo: SubscriptionRepositoryInterface,
    private readonly metrics: SubscriptionMetrics,
  ) {}

  create() {
    const metricsRepo = new MetricsSubscriptionRepositoryDecorator(
      this.repo,
      this.metrics,
    );

    return new SubscriptionService(metricsRepo);
  }
}
