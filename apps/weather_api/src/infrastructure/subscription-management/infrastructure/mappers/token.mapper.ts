import { Token } from '@prisma/client';
import { TokenEntity } from 'apps/weather_api/src/infrastructure/subscription-management/core/entities/subscription.entity';

export class TokenMapper {
  static toDomain(token: Token): TokenEntity {
    return {
      tokenId: token.tokenId,
      subscriptionId: token.subscriptionId,
      token: token.token,
      createdAt: token.createdAt,
      expiresAt: token.expiresAt ?? new Date(0),
    };
  }
}
