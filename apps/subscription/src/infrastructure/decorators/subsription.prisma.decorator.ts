import { LoggerInterface } from 'libs/core/logger/logger.interface';

import { LoggingDecoratorBase } from './logger.abstract';
import {
  Frequency,
  SubscriptionEntity,
} from '../../core/entities/subscription.entity';
import {
  SubscriptionParams,
  SubscriptionRepositoryInterface,
} from '../../core/subscription/subscription-repository.interface';

export class LoggingSubscriptionRepositoryDecorator
  extends LoggingDecoratorBase<SubscriptionRepositoryInterface>
  implements SubscriptionRepositoryInterface
{
  constructor(
    wrapped: SubscriptionRepositoryInterface,
    logger: LoggerInterface,
  ) {
    super(wrapped, logger, 'SubscriptionRepository');
  }

  create(params: SubscriptionParams): Promise<SubscriptionEntity> {
    return this.logAndExecute('create', params, () =>
      this.wrapped.create(params),
    );
  }

  findOne(email: string, city: string): Promise<SubscriptionEntity | null> {
    return this.logAndExecute('findOne', { email, city }, () =>
      this.wrapped.findOne(email, city),
    );
  }

  delete(subscriptionId: string): Promise<SubscriptionEntity> {
    return this.logAndExecute('delete', { subscriptionId }, () =>
      this.wrapped.delete(subscriptionId),
    );
  }

  confirm(subscriptionId: string): Promise<SubscriptionEntity> {
    return this.logAndExecute('confirm', { subscriptionId }, () =>
      this.wrapped.confirm(subscriptionId),
    );
  }

  findByFrequency(frequency: Frequency): Promise<SubscriptionEntity[]> {
    return this.logAndExecute('findByFrequency', { frequency }, () =>
      this.wrapped.findByFrequency(frequency),
    );
  }

  deleteUnconfirmed(): Promise<{ count: number }> {
    return this.logAndExecute('deleteUnconfirmed', {}, () =>
      this.wrapped.deleteUnconfirmed(),
    );
  }
}
