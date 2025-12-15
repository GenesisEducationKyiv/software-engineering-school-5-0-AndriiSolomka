import { SubsWithToken } from './subscription.entity';

export const SUBSCRIPTION_PACKAGE = Symbol('SUBSCRIPTION_PACKAGE');

export enum Frequency {
  hourly = 'hourly',
  daily = 'daily',
}

export type GetByFrequencyRequest = {
  frequency: Frequency;
};

export type SubscriptionPayload = {
  email: string;
  city: string;
  frequency: Frequency;
};

export interface SubscriptionInterface {
  getByFrequency(request: GetByFrequencyRequest): Promise<SubsWithToken>;
  deleteUnconfirmed(): Promise<{ count: number }>;
}
