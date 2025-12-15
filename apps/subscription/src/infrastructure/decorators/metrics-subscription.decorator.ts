import { Injectable } from '@nestjs/common';

import {
  Frequency,
  SubscriptionEntity,
} from '../../core/entities/subscription.entity';
import {
  SubscriptionParams,
  SubscriptionRepositoryInterface,
} from '../../core/subscription/subscription-repository.interface';
import { SubscriptionMetrics } from '../metrics/subscription-metrics';

@Injectable()
export class MetricsSubscriptionRepositoryDecorator
  implements SubscriptionRepositoryInterface
{
  constructor(
    private readonly decorated: SubscriptionRepositoryInterface,
    private readonly metrics: SubscriptionMetrics,
  ) {}

  create(params: SubscriptionParams): Promise<SubscriptionEntity> {
    return this.metrics.withDuration('create', () =>
      this.decorated.create(params),
    );
  }

  findOne(email: string, city: string): Promise<SubscriptionEntity | null> {
    return this.metrics.withDuration('findOne', () =>
      this.decorated.findOne(email, city),
    );
  }

  delete(subscriptionId: string): Promise<SubscriptionEntity> {
    return this.metrics.withDuration('delete', () =>
      this.decorated.delete(subscriptionId),
    );
  }

  confirm(subscriptionId: string): Promise<SubscriptionEntity> {
    return this.metrics.withDuration('confirm', () =>
      this.decorated.confirm(subscriptionId),
    );
  }

  findByFrequency(frequency: Frequency): Promise<SubscriptionEntity[]> {
    return this.metrics.withDuration('findByFrequency', () =>
      this.decorated.findByFrequency(frequency),
    );
  }

  deleteUnconfirmed(): Promise<{ count: number }> {
    return this.metrics.withDuration('deleteUnconfirmed', () =>
      this.decorated.deleteUnconfirmed(),
    );
  }
}
