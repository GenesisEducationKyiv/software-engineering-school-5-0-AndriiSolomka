import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSubscriptionDto } from '../subscribe/dto/create-subscribe.dto';
import { Subscription } from '@prisma/client';

@Injectable()
export class SubscriptionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateSubscriptionDto): Promise<Subscription> {
    const { email, city, frequency } = dto;
    return await this.prisma.subscription.create({
      data: { email, city, frequency },
    });
  }

  async findOne(email: string, city: string): Promise<Subscription | null> {
    return this.prisma.subscription.findFirst({ where: { email, city } });
  }

  async delete(subscription_id: number): Promise<Subscription> {
    return await this.prisma.subscription.delete({
      where: { subscription_id },
    });
  }

  async confirmSubscription(subscription_id: number): Promise<Subscription> {
    return this.prisma.subscription.update({
      where: { subscription_id },
      data: { confirmed: true },
    });
  }
}
