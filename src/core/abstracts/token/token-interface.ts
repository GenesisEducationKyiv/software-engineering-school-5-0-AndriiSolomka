import { TokenEntity } from 'src/core/entities/subscription.entity';

export interface TokenInterface {
  create(subscription_id: number): Promise<string>;
  getEntity(token: string): Promise<TokenEntity>;
}
