import { ConflictException, Injectable } from '@nestjs/common';
import { SubscriptionRepository } from './subscription.repository';
import { CreateSubscriptionDto } from 'src/subscribe/dto/create-subscribe.dto';

@Injectable()
export class SubscriptionService {
  constructor(private readonly subscriptionRepo: SubscriptionRepository) {}

  async createSubscriptionDto(dto: CreateSubscriptionDto) {
    const { email, city, frequency } = dto;
    const subscription = await this.subscriptionRepo.findOne(email, city);
    if (subscription) throw new ConflictException('Email already exists');

    return await this.subscriptionRepo.create({ email, city, frequency });
  }

  async confirmSubscription(subscription_id: number) {
    return await this.subscriptionRepo.confirmSubscription(subscription_id);
  }
}
