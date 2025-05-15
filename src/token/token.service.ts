import { Injectable, NotFoundException } from '@nestjs/common';
import { TokenRepository } from './token.repository';
import { randomByteGenerator } from 'src/utils/generator/random-generator';
import { Token } from '@prisma/client';

@Injectable()
export class TokenService {
  constructor(private readonly tokenRepo: TokenRepository) {}

  generateToken() {
    return randomByteGenerator();
  }

  async create(subscription_id: number): Promise<string> {
    const token = this.generateToken();
    await this.tokenRepo.create(token, subscription_id);
    return token;
  }

  async getEntity(token: string): Promise<Token> {
    const tokenEntity = await this.tokenRepo.findOne(token);
    if (!tokenEntity) throw new NotFoundException('Invalid token');
    return tokenEntity;
  }
}
