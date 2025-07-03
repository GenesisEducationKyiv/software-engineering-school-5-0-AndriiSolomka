import { Injectable } from '@nestjs/common';
import { Frequency, Subscription } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { SubscriptionParams } from 'src/core/abstracts/subscription/subscription-repository.interface';

import { PrismaService } from '../database/prisma.service';

export type SubWithTokens = Prisma.SubscriptionGetPayload<{
  include: { tokens: true };
}>;

@Injectable()
export class PrismaSubscriptionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(params: SubscriptionParams): Promise<Subscription> {
    const { email, city, frequency } = params;
    return await this.prisma.subscription.create({
      data: { email, city, frequency },
    });
  }

  async findOne(email: string, city: string): Promise<Subscription | null> {
    return await this.prisma.subscription.findFirst({ where: { email, city } });
  }

  async delete(subscription_id: number): Promise<Subscription> {
    return await this.prisma.subscription.delete({
      where: { subscription_id },
    });
  }

  async confirm(subscription_id: number): Promise<Subscription> {
    return await this.prisma.subscription.update({
      where: { subscription_id },
      data: { confirmed: true },
    });
  }

  async findByFrequency(frequency: Frequency): Promise<SubWithTokens[]> {
    return await this.prisma.subscription.findMany({
      where: { confirmed: true, frequency },
      include: { tokens: true },
    });
  }

  async deleteUnconfirmed(): Promise<{ count: number }> {
    return await this.prisma.subscription.deleteMany({
      where: { confirmed: false },
    });
  }
}
