import {
  Frequency,
  SubscriptionEntity,
} from 'src/core/entities/subscription.entity';

import { SubscriptionParams } from './subscription-repository.interface';

export interface SubscriptionServiceInterface {
  create(data: SubscriptionParams): Promise<SubscriptionEntity>;
  confirm(subscription_id: number): Promise<SubscriptionEntity>;
  delete(subscription_id: number): Promise<SubscriptionEntity>;
  getByFrequency(frequency: Frequency): Promise<SubscriptionEntity[]>;
  deleteUnconfirmed(): Promise<{ count: number }>;
}
