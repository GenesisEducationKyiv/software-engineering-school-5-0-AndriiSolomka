import { TokenEntity } from 'src/infrastructure/subscription-management/core/entities/subscription.entity';

export const TokenInterfaceToken = Symbol('TokenInterface');

export interface TokenInterface {
  create(subscription_id: number): Promise<string>;
  getEntity(token: string): Promise<TokenEntity>;
}
