import { SubscriptionParams } from './subscription-repository.interface';
import { Frequency, SubscriptionEntity } from '../entities/subscription.entity';

export const SubscriptionToken = Symbol('SubscriptionToken');

export interface SubscriptionInterface {
  create(data: SubscriptionParams): Promise<SubscriptionEntity>;
  confirm(subscriptionId: string): Promise<SubscriptionEntity>;
  delete(subscriptionId: string): Promise<SubscriptionEntity>;
  getByFrequency(frequency: Frequency): Promise<SubscriptionEntity[]>;
  deleteUnconfirmed(): Promise<{ count: number }>;
}
