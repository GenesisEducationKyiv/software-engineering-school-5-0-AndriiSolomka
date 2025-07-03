export enum Frequency {
  Hourly = 'hourly',
  Daily = 'daily',
}

export interface TokenEntity {
  token_id: number;
  subscription_id: number;
  token: string;
  createdAt: Date;
  expiresAt: Date;
}

export interface SubscriptionEntity {
  subscription_id: number;
  email: string;
  city: string;
  frequency: Frequency;
  confirmed: boolean;
  createdAt: Date;
  updatedAt: Date;
  tokens: TokenEntity[];
}
