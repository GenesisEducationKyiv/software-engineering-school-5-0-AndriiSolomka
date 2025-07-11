import { Injectable } from '@nestjs/common';
import { TokenEntity } from 'src/infrastructure/subscription-management/core/entities/subscription.entity';
import { TokenRepositoryInterface } from 'src/infrastructure/subscription-management/core/token/token-repository.interface';

import { PrismaService } from '../../infrastructure/database/prisma.service';
import { TokenMapper } from '../../infrastructure/mappers/token.mapper';

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
