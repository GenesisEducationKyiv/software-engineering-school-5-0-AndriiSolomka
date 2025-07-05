import { Token } from '@prisma/client';
import { TokenEntity } from 'src/core/entities/subscription.entity';

export class TokenMapper {
  static toDomain(token: Token): TokenEntity {
    return {
      token_id: token.token_id,
      subscription_id: token.subscription_id,
      token: token.token,
      createdAt: token.createdAt,
      expiresAt: token.expiresAt ?? new Date(0),
    };
  }
}
