import { Token } from '@prisma/client';

export interface ITokenService {
  create(subscription_id: number): Promise<string>;
  getEntity(token: string): Promise<Token>;
}
