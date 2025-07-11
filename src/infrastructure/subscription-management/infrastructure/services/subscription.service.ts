import { Inject, Injectable } from '@nestjs/common';
import { SubscriptionAlreadyExistsException } from 'common/errors/subscription.errors';
import {
  Frequency,
  SubscriptionEntity,
} from 'src/infrastructure/subscription-management/core/entities/subscription.entity';
import {
  SubscriptionParams,
  SubscriptionRepositoryInterface,
  SubscriptionRepositoryToken,
} from 'src/infrastructure/subscription-management/core/subscription/subscription-repository.interface';
import { SubscriptionInterface } from 'src/infrastructure/subscription-management/core/subscription/subscription.interface';

@Injectable()
export class SubscriptionService implements SubscriptionInterface {
  constructor(
    @Inject(SubscriptionRepositoryToken)
    private readonly subscriptionRepo: SubscriptionRepositoryInterface,
  ) {}

  async create(data: SubscriptionParams): Promise<SubscriptionEntity> {
    const { email, city, frequency } = data;

    const subscription = await this.subscriptionRepo.findOne(email, city);
    if (subscription) throw new SubscriptionAlreadyExistsException(email, city);

    return await this.subscriptionRepo.create({ email, city, frequency });
  }

  async confirm(subscription_id: number): Promise<SubscriptionEntity> {
    return await this.subscriptionRepo.confirm(subscription_id);
  }

  async delete(subscription_id: number): Promise<SubscriptionEntity> {
    return await this.subscriptionRepo.delete(subscription_id);
  }

  async getByFrequency(frequency: Frequency): Promise<SubscriptionEntity[]> {
    return this.subscriptionRepo.findByFrequency(frequency);
  }

  async deleteUnconfirmed(): Promise<{ count: number }> {
    return await this.subscriptionRepo.deleteUnconfirmed();
  }
}
