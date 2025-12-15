export type SubscriptionEntity = {
  email: string;
  city: string;
  tokens: TokenEntity[];
};

export type TokenEntity = {
  token: string;
};

export type SubsWithToken = {
  subscriptions: SubscriptionEntity[];
};
