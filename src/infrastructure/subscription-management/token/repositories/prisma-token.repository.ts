import { Injectable } from '@nestjs/common';
import { TokenRepositoryInterface } from 'src/core/abstracts/token/token-repository.interface';
import { TokenEntity } from 'src/core/entities/subscription.entity';

import { TokenMapper } from '../../mappers/token.mapper';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class PrismaTokenRepository implements TokenRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async create(token: string, subscriptionId: number): Promise<TokenEntity> {
    const createdToken = await this.prisma.token.create({
      data: { token, subscriptionId },
    });
    return TokenMapper.toDomain(createdToken);
  }

  async findOne(token: string): Promise<TokenEntity | null> {
    const foundToken = await this.prisma.token.findFirst({ where: { token } });
    return foundToken ? TokenMapper.toDomain(foundToken) : null;
  }
}
