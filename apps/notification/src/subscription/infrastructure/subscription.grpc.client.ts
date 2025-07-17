import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';

import {
  Frequency,
  SUBSCRIPTION_PACKAGE,
  SubscriptionEntity,
  SubscriptionInterface,
} from '../../subscription/core/subscription.interface';

@Injectable()
export class SubscriptionClientService
  implements OnModuleInit, SubscriptionInterface
{
  private subscriptionService: SubscriptionInterface;

  constructor(
    @Inject(SUBSCRIPTION_PACKAGE)
    private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.subscriptionService = this.client.getService<SubscriptionInterface>(
      'SubscriptionService',
    );
  }

  async getByFrequency(frequency: Frequency): Promise<SubscriptionEntity[]> {
    return this.subscriptionService.getByFrequency(frequency);
  }

  async deleteUnconfirmed(): Promise<{ count: number }> {
    return this.subscriptionService.deleteUnconfirmed();
  }
}
