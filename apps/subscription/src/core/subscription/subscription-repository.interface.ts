import { Frequency, SubscriptionEntity } from '../entities/subscription.entity';

export type SubscriptionParams = {
  email: string;
  city: string;
  frequency: Frequency;
};
export const SubscriptionRepositoryToken = Symbol('SubscriptionRepository');

export interface SubscriptionRepositoryInterface {
  create(params: SubscriptionParams): Promise<SubscriptionEntity>;
  findOne(email: string, city: string): Promise<SubscriptionEntity | null>;
  delete(subscription_id: string): Promise<SubscriptionEntity>;
  confirm(subscription_id: string): Promise<SubscriptionEntity>;
  findByFrequency(frequency: Frequency): Promise<SubscriptionEntity[]>;
  deleteUnconfirmed(): Promise<{ count: number }>;
}
