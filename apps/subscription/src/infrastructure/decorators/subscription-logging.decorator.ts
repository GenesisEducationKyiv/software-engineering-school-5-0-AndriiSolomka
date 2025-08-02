import { LoggerInterface } from 'libs/core/logger/logger.interface';

import { LoggingDecoratorBase } from '../../../../../libs/infrastructure/logger/logger.abstract';
import {
  Frequency,
  SubscriptionEntity,
} from '../../core/entities/subscription.entity';
import { SubscriptionParams } from '../../core/subscription/subscription-repository.interface';
import { SubscriptionInterface } from '../../core/subscription/subscription.interface';
import { SubscriptionService } from '../services/subscription.service';

export class LoggingSubscriptionServiceDecorator
  extends LoggingDecoratorBase<SubscriptionInterface>
  implements SubscriptionInterface
{
  constructor(wrapped: SubscriptionInterface, logger: LoggerInterface) {
    super(wrapped, logger, SubscriptionService.name);
  }

  create(data: SubscriptionParams): Promise<SubscriptionEntity> {
    return this.logAndExecute('create', { data }, () =>
      this.wrapped.create(data),
    );
  }

  confirm(subscriptionId: string): Promise<SubscriptionEntity> {
    return this.logAndExecute('confirm', { subscriptionId }, () =>
      this.wrapped.confirm(subscriptionId),
    );
  }

  delete(subscriptionId: string): Promise<SubscriptionEntity> {
    return this.logAndExecute('delete', { subscriptionId }, () =>
      this.wrapped.delete(subscriptionId),
    );
  }

  getByFrequency(frequency: Frequency): Promise<SubscriptionEntity[]> {
    return this.logAndExecute('getByFrequency', { frequency }, () =>
      this.wrapped.getByFrequency(frequency),
    );
  }

  deleteUnconfirmed(): Promise<{ count: number }> {
    return this.logAndExecute('deleteUnconfirmed', {}, () =>
      this.wrapped.deleteUnconfirmed(),
    );
  }
}
