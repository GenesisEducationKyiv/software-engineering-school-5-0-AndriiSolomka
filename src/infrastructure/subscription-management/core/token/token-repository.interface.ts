import { TokenEntity } from 'src/infrastructure/subscription-management/core/entities/subscription.entity';

export const TokenRepositoryToken = Symbol('TokenRepository');

export interface TokenRepositoryInterface {
  create(token: string, subscription_id: number): Promise<TokenEntity>;
  findOne(token: string): Promise<TokenEntity | null>;
}
