import { Injectable } from '@nestjs/common';

import {
  Frequency,
  SubscriptionEntity,
} from '../../core/entities/subscription.entity';
import {
  SubscriptionParams,
  SubscriptionRepositoryInterface,
} from '../../core/subscription/subscription-repository.interface';
import { SUBSCRIPTION_OPERATION_STATUS } from '../metrics/constants/metrics.constants';
import { SubscriptionMetrics } from '../metrics/subscription-metrics';

@Injectable()
export class MetricsSubscriptionRepositoryDecorator
  implements SubscriptionRepositoryInterface
{
  constructor(
    private readonly decorated: SubscriptionRepositoryInterface,
    private readonly metrics: SubscriptionMetrics,
  ) {}

  private async wrapWithMetrics<T>(
    method: string,
    fn: () => Promise<T>,
  ): Promise<T> {
    const end = this.metrics.createOperationStopper(method);
    try {
      const result = await fn();
      this.metrics.recordOperation(
        method,
        SUBSCRIPTION_OPERATION_STATUS.SUCCESS,
      );
      end(SUBSCRIPTION_OPERATION_STATUS.SUCCESS);
      return result;
    } catch (error) {
      this.metrics.recordOperation(method, SUBSCRIPTION_OPERATION_STATUS.ERROR);
      end(SUBSCRIPTION_OPERATION_STATUS.ERROR);
      throw error;
    }
  }

  create(params: SubscriptionParams): Promise<SubscriptionEntity> {
    return this.wrapWithMetrics('create', () => this.decorated.create(params));
  }

  findOne(email: string, city: string): Promise<SubscriptionEntity | null> {
    return this.wrapWithMetrics('findOne', () =>
      this.decorated.findOne(email, city),
    );
  }

  delete(subscriptionId: string): Promise<SubscriptionEntity> {
    return this.wrapWithMetrics('delete', () =>
      this.decorated.delete(subscriptionId),
    );
  }

  confirm(subscriptionId: string): Promise<SubscriptionEntity> {
    return this.wrapWithMetrics('confirm', () =>
      this.decorated.confirm(subscriptionId),
    );
  }

  findByFrequency(frequency: Frequency): Promise<SubscriptionEntity[]> {
    return this.wrapWithMetrics('findByFrequency', () =>
      this.decorated.findByFrequency(frequency),
    );
  }

  deleteUnconfirmed(): Promise<{ count: number }> {
    return this.wrapWithMetrics('deleteUnconfirmed', () =>
      this.decorated.deleteUnconfirmed(),
    );
  }
}
