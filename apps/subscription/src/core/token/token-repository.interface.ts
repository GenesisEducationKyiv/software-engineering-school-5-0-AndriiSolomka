import { TokenEntity } from '../entities/subscription.entity';

export const TokenRepositoryToken = Symbol('TokenRepository');

export interface TokenRepositoryInterface {
  create(token: string, subscriptionId: string): Promise<TokenEntity>;
  findOne(token: string): Promise<TokenEntity | null>;
}
