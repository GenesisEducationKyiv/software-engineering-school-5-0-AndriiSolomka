export const SUBSCRIPTION_PACKAGE = Symbol('SUBSCRIPTION_PACKAGE');

export enum Frequency {
  hourly = 'hourly',
  daily = 'daily',
}

export type SubscribeParams = {
  email: string;
  city: string;
  frequency: Frequency;
};

export interface SubscriptionInterface {
  subscribe(data: SubscribeParams): Promise<{ email: string; token: string }>;
  confirm(token: string): Promise<{ message: string }>;
  unsubscribe(token: string): Promise<{ message: string }>;
}
