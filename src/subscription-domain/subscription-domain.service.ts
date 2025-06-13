import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { CreateSubscriptionDto } from 'src/subscription-handlers/dto/create-subscription.dto';
import { Frequency, Subscription } from '@prisma/client';
import { SubWithTokens } from 'src/constants/types/prisma/subscription.type';
import {
  ISubscriptionRepository,
  ISubscriptionRepositoryToken,
} from './interfaces/subscription-repository.interface';

@Injectable()
export class SubscriptionDomainService {
  constructor(
    @Inject(ISubscriptionRepositoryToken)
    private readonly subscriptionRepo: ISubscriptionRepository,
  ) {}

  async create(dto: CreateSubscriptionDto): Promise<Subscription> {
    const { email, city, frequency } = dto;
    await this.findUnique(email, city);
    return await this.subscriptionRepo.create({ email, city, frequency });
  }

  async findUnique(email: string, city: string): Promise<Subscription | null> {
    const subscription = await this.subscriptionRepo.findOne(email, city);
    if (subscription) {
      throw new ConflictException(`Email already subscribed to ${city}`);
    }
    return subscription;
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
