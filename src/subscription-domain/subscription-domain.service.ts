import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { CreateSubscriptionDto } from 'src/subscription-handlers/dto/create-subscription.dto';
import { Frequency, Subscription } from '@prisma/client';
import { SubWithTokens } from 'src/constants/types/prisma/subscription.type';
import {
  SubscriptionRepository,
  SubscriptionRepositoryToken,
} from './interfaces/subscription-repository.interface';
import type { ISubscriptionDomainService } from 'src/subscription-domain/interfaces/subscription-service.interface';
import { SubscriptionAlreadyExistsException } from 'src/common/errors/subscription.errors';

@Injectable()
export class SubscriptionDomainService implements ISubscriptionDomainService {
  constructor(
    @Inject(SubscriptionRepositoryToken)
    private readonly subscriptionRepo: SubscriptionRepository,
  ) {}

  async create(dto: CreateSubscriptionDto): Promise<Subscription> {
    const { email, city, frequency } = dto;

    const subscription = await this.subscriptionRepo.findOne(email, city);
    if (subscription) throw new SubscriptionAlreadyExistsException(email, city);

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
