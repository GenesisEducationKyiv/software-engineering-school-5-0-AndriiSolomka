import { ConflictException, Injectable } from '@nestjs/common';
import { SubscriptionRepository } from './subscription-domain.repository';
import { CreateSubscriptionDto } from 'src/subscription-handlers/dto/create-subscription.dto';
import { Frequency, Subscription } from '@prisma/client';
import { SubWithTokens } from 'src/constants/types/prisma/subscription.type';

@Injectable()
export class SubscriptionDomainService {
  constructor(private readonly subscriptionRepo: SubscriptionRepository) {}

  async create(dto: CreateSubscriptionDto): Promise<Subscription> {
    const { email, city, frequency } = dto;
    const subscription = await this.subscriptionRepo.findOne(email, city);
    if (subscription) {
      throw new ConflictException(`Email already subscribed to ${city}`);
    }
    return await this.subscriptionRepo.create({ email, city, frequency });
  }

  async confirm(subscription_id: number): Promise<Subscription> {
    return await this.subscriptionRepo.confirm(subscription_id);
  }

  async delete(subscription_id: number): Promise<Subscription> {
    return await this.subscriptionRepo.delete(subscription_id);
  }

  async getByFrequency(frequency: Frequency): Promise<SubWithTokens[]> {
    return this.subscriptionRepo.findByFrequency(frequency);
  }

  async deleteUnconfirmed(): Promise<{ count: number }> {
    return await this.subscriptionRepo.deleteUnconfirmed();
  }
}
