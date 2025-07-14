export enum Frequency {
  hourly = 'hourly',
  daily = 'daily',
}

export interface TokenEntity {
  tokenId: number;
  subscriptionId: number;
  token: string;
  createdAt: Date;
  expiresAt: Date;
}

export interface SubscriptionEntity {
  subscriptionId: number;
  email: string;
  city: string;
  frequency: Frequency;
  confirmed: boolean;
  createdAt: Date;
  updatedAt: Date;
  tokens: TokenEntity[];
}
