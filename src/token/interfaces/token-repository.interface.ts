import { Token } from '@prisma/client';

export interface ITokenRepository {
  create(token: string, subscription_id: number): Promise<Token>;
  findOne(token: string): Promise<Token | null>;
}

export const ITokenRepositoryToken = Symbol('ITokenRepository');
