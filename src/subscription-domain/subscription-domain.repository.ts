import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSubscriptionDto } from '../subscription-handlers/dto/create-subscription.dto';
import { Frequency, Subscription } from '@prisma/client';
import { SubWithTokens } from 'src/constants/types/prisma/subscription.type';
import { ISubscriptionRepository } from './interfaces/subscription-repository.interface';

@Injectable()
export class SubscriptionRepository implements ISubscriptionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateSubscriptionDto): Promise<Subscription> {
    const { email, city, frequency } = dto;
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
