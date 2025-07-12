export const SUBSCRIPTION_PACKAGE = Symbol('SUBSCRIPTION_PACKAGE');

export enum Frequency {
  hourly = 'hourly',
  daily = 'daily',
}

export type SubscriptionEntity = {
  subscriptionId: number;
  email: string;
  city: string;
  frequency: Frequency;
  confirmed: boolean;
};

export interface SubscriptionInterface {
  getByFrequency(frequency: Frequency): Promise<SubscriptionEntity[]>;
  deleteUnconfirmed(): Promise<{ count: number }>;
}
