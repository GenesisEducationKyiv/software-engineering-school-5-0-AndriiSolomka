import { Subscription, Token } from '@prisma/client';
import {
  Frequency,
  SubscriptionEntity,
} from 'src/infrastructure/subscription-management/core/entities/subscription.entity';

import { TokenMapper } from './token.mapper';

export class SubscriptionMapper {
  static toDomain(
    subscription: Subscription & { tokens?: Token[] },
  ): SubscriptionEntity {
    return {
      subscriptionId: subscription.subscriptionId,
      email: subscription.email,
      city: subscription.city,
      frequency: subscription.frequency as Frequency,
      confirmed: subscription.confirmed,
      createdAt: subscription.createdAt,
      updatedAt: subscription.updatedAt,
      tokens: (subscription.tokens || []).map((token) =>
        TokenMapper.toDomain(token),
      ),
    };
  }

  static toList(
    subscriptions: (Subscription & { tokens?: Token[] })[],
  ): SubscriptionEntity[] {
    return subscriptions.map((subscription) => this.toDomain(subscription));
  }
}
