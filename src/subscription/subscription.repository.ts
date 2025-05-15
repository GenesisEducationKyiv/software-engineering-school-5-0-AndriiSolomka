import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSubscriptionDto } from '../subscribe/dto/create-subscribe.dto';
import { UpdateSubscribeDto } from '../subscribe/dto/update-subscribe.dto';
import { Subscription } from '@prisma/client';

@Injectable()
export class SubscriptionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateSubscriptionDto) {
    const { email, city, frequency } = dto;
    return await this.prisma.subscription.create({
      data: { email, city, frequency },
    });
  }

  async findOne(email: string, city: string): Promise<Subscription | null> {
    return this.prisma.subscription.findFirst({ where: { email, city } });
  }

  async update(email: string, city: string, dto: UpdateSubscribeDto) {
    const subscription = await this.findOne(email, city);
    if (!subscription) throw new NotFoundException('Subscription not found');

    return this.prisma.subscription.update({
      where: { subscription_id: subscription.subscription_id },
      data: dto,
    });
  }

  async delete(subscription_id: number) {
    return await this.prisma.subscription.delete({
      where: { subscription_id },
    });
  }

  async confirmSubscription(subscription_id: number) {
    return this.prisma.subscription.update({
      where: { subscription_id },
      data: { confirmed: true },
    });
  }
}
