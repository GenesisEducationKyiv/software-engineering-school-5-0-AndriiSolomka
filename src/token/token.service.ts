import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { randomByteGenerator } from 'src/utils/generator/random-generator';
import { Token } from '@prisma/client';
import {
  TokenRepository,
  TokenRepositoryToken,
} from './interfaces/token-repository.interface';
import type { ITokenService } from 'src/token/interfaces/token-service.interface';

@Injectable()
export class TokenService implements ITokenService {
  constructor(
    @Inject(TokenRepositoryToken)
    private readonly tokenRepo: TokenRepository,
  ) {}

  async create(subscription_id: number): Promise<string> {
    const token = randomByteGenerator();
    await this.tokenRepo.create(token, subscription_id);
    return token;
  }

  async getEntity(token: string): Promise<Token> {
    const tokenEntity = await this.tokenRepo.findOne(token);
    if (!tokenEntity) throw new NotFoundException('Token not found');
    return tokenEntity;
  }
}
