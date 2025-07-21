import { TokenEntity } from '../entities/subscription.entity';

export const TokenInterfaceToken = Symbol('TokenInterface');

export interface TokenInterface {
  create(subscriptionId: string): Promise<string>;
  getEntity(token: string): Promise<TokenEntity>;
}
