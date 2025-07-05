import { Injectable } from '@nestjs/common';
import { TokenRepositoryInterface } from 'src/core/abstracts/token/token-repository.interface';
import { TokenEntity } from 'src/core/entities/subscription.entity';

import { PrismaService } from '../database/prisma.service';
import { TokenMapper } from './mappers/token.mapper';

@Injectable()
export class PrismaTokenRepository implements TokenRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async create(token: string, subscription_id: number): Promise<TokenEntity> {
    const createdToken = await this.prisma.token.create({
      data: { token, subscription_id },
    });
    return TokenMapper.toDomain(createdToken);
  }

  async findOne(token: string): Promise<TokenEntity | null> {
    const foundToken = await this.prisma.token.findFirst({ where: { token } });
    return foundToken ? TokenMapper.toDomain(foundToken) : null;
  }
}
