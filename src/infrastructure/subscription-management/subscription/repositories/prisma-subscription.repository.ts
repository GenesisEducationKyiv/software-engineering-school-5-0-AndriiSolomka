import { Injectable } from '@nestjs/common';
import {
  SubscriptionParams,
  SubscriptionRepositoryInterface,
} from 'src/core/abstracts/subscription/subscription-repository.interface';
import {
  Frequency,
  SubscriptionEntity,
} from 'src/core/entities/subscription.entity';
import { PrismaService } from 'src/infrastructure/database/prisma.service';
import { SubscriptionMapper } from 'src/infrastructure/subscription-management/mappers/subscription.mapper';

@Injectable()
export class PrismaSubscriptionRepository
  implements SubscriptionRepositoryInterface
{
  constructor(private readonly prisma: PrismaService) {}

  async create(params: SubscriptionParams): Promise<SubscriptionEntity> {
    const { email, city, frequency } = params;
    const subscription = await this.prisma.subscription.create({
      data: { email, city, frequency },
    });

    return SubscriptionMapper.toDomain(subscription);
  }

  async findOne(
    email: string,
    city: string,
  ): Promise<SubscriptionEntity | null> {
    const subscription = await this.prisma.subscription.findFirst({
      where: { email, city },
    });
    return subscription ? SubscriptionMapper.toDomain(subscription) : null;
  }

  async delete(subscriptionId: number): Promise<SubscriptionEntity> {
    const subscription = await this.prisma.subscription.delete({
      where: { subscriptionId },
    });

    return SubscriptionMapper.toDomain(subscription);
  }

  async confirm(subscriptionId: number): Promise<SubscriptionEntity> {
    const subscription = await this.prisma.subscription.update({
      where: { subscriptionId },
      data: { confirmed: true },
    });

    return SubscriptionMapper.toDomain(subscription);
  }

  async findByFrequency(frequency: Frequency): Promise<SubscriptionEntity[]> {
    const subscriptions = await this.prisma.subscription.findMany({
      where: { confirmed: true, frequency },
      include: { tokens: true },
    });

    return SubscriptionMapper.toList(subscriptions);
  }

  async deleteUnconfirmed(): Promise<{ count: number }> {
    return await this.prisma.subscription.deleteMany({
      where: { confirmed: false },
    });
  }
}
