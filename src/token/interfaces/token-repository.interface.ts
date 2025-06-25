import { Token } from '@prisma/client';

export interface TokenRepository {
  create(token: string, subscription_id: number): Promise<Token>;
  findOne(token: string): Promise<Token | null>;
}

export const TokenRepositoryToken = Symbol('ITokenRepository');
