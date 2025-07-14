export const SUBSCRIPTION_PACKAGE = Symbol('SUBSCRIPTION_PACKAGE');

export enum Frequency {
  hourly = 'hourly',
  daily = 'daily',
}

export interface SubscriptionEntity {
  email: string;
  city: string;
  tokens: TokenEntity[];
}

export interface TokenEntity {
  token: string;
}

export interface SubscriptionInterface {
  getByFrequency(frequency: Frequency): Promise<SubscriptionEntity[]>;
  deleteUnconfirmed(): Promise<{ count: number }>;
}
