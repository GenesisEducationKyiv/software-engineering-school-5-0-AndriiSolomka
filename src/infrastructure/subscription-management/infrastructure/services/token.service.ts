import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TokenEntity } from 'src/infrastructure/subscription-management/core/entities/subscription.entity';
import { TokenInterface } from 'src/infrastructure/subscription-management/core/token/token-interface';
import {
  TokenRepositoryInterface,
  TokenRepositoryToken,
} from 'src/infrastructure/subscription-management/core/token/token-repository.interface';
import { randomByteGenerator } from 'src/utils/generator/random-generator';

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
    if (!tokenEntity) throw new NotFoundException('Token not found');
    return tokenEntity;
  }
}
