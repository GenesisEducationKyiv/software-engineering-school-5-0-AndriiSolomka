import { Inject, Injectable } from '@nestjs/common';
import { randomByteGenerator } from 'libs/utils/generator/random-generator';

import { TokenEntity } from '../../core/entities/subscription.entity';
import { TokenInterface } from '../../core/token/token-interface';
import {
  TokenRepositoryInterface,
  TokenRepositoryToken,
} from '../../core/token/token-repository.interface';
import { TokenNotFoundException } from '../errors/custom.errors';

@Injectable()
export class TokenService implements TokenInterface {
  constructor(
    @Inject(TokenRepositoryToken)
    private readonly tokenRepo: TokenRepositoryInterface,
  ) {}

  async create(subscription_id: number): Promise<string> {
    const token = randomByteGenerator();
    await this.tokenRepo.create(token, subscription_id);
    return token;
  }

  async getEntity(token: string): Promise<TokenEntity> {
    const tokenEntity = await this.tokenRepo.findOne(token);
    if (!tokenEntity) throw new TokenNotFoundException();
    return tokenEntity;
  }
}
