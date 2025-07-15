export enum Frequency {
  Hourly = 'hourly',
  Daily = 'daily',
}

export interface TokenEntity {
  tokenId: string;
  subscriptionId: string;
  token: string;
  createdAt: Date;
  expiresAt: Date;
}

export interface SubscriptionEntity {
  subscriptionId: string;
  email: string;
  city: string;
  frequency: Frequency;
  confirmed: boolean;
  createdAt: Date;
  updatedAt: Date;
  tokens: TokenEntity[];
}
