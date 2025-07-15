import { Inject, Injectable } from '@nestjs/common';
import { SubscriptionAlreadyExistsException } from 'src/common/errors/subscription.errors';
import {
  SubscriptionParams,
  SubscriptionRepositoryInterface,
  SubscriptionRepositoryToken,
} from 'src/core/abstracts/subscription/subscription-repository.interface';
import { SubscriptionInterface } from 'src/core/abstracts/subscription/subscription.interface';
import {
  Frequency,
  SubscriptionEntity,
} from 'src/core/entities/subscription.entity';

@Injectable()
export class SubscriptionDomainUseCase implements SubscriptionInterface {
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

  async confirm(subscription_id: string): Promise<SubscriptionEntity> {
    return await this.subscriptionRepo.confirm(subscription_id);
  }

  async delete(subscription_id: string): Promise<SubscriptionEntity> {
    return await this.subscriptionRepo.delete(subscription_id);
  }

  async getByFrequency(frequency: Frequency): Promise<SubscriptionEntity[]> {
    return this.subscriptionRepo.findByFrequency(frequency);
  }

  async deleteUnconfirmed(): Promise<{ count: number }> {
    return await this.subscriptionRepo.deleteUnconfirmed();
  }
}
