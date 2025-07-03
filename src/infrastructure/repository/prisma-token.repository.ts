import { Injectable } from '@nestjs/common';
import { Token } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class PrismaTokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(token: string, subscription_id: number): Promise<Token> {
    return await this.prisma.token.create({ data: { token, subscription_id } });
  }

  async findOne(token: string): Promise<Token | null> {
    return await this.prisma.token.findFirst({ where: { token } });
  }
}
