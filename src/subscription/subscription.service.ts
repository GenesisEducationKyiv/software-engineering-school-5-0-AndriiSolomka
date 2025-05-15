import { ConflictException, Injectable } from '@nestjs/common';
import { SubscriptionRepository } from './subscription.repository';
import { CreateSubscriptionDto } from 'src/subscribe/dto/create-subscribe.dto';
import { Frequency, Subscription } from '@prisma/client';
import { SubWithTokens } from 'src/constants/types/prisma/subscription.type';

@Injectable()
export class SubscriptionService {
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

  async getUnconfirmed(): Promise<Subscription[]> {
    return await this.subscriptionRepo.findUnconfirmed();
  }

  async getByFrequency(frequency: Frequency): Promise<SubWithTokens[]> {
    return this.subscriptionRepo.findByFrequency(frequency);
  }

  async deleteUnconfirmed(): Promise<void> {
    const unconfirmed = await this.getUnconfirmed();
    if (unconfirmed.length) {
      for (const subscription of unconfirmed) {
        await this.delete(subscription.subscription_id);
      }
    }
  }
}
