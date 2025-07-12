import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';

import {
  SUBSCRIPTION_PACKAGE,
  SubscribeParams,
  SubscriptionInterface,
} from '../core/subscription.interface';

@Injectable()
export class SubscriptionClientService implements OnModuleInit {
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

  async subscribe(
    data: SubscribeParams,
  ): Promise<{ email: string; token: string }> {
    return this.subscriptionService.subscribe(data);
  }

  async confirm(token: string): Promise<{ message: string }> {
    return this.subscriptionService.confirm(token);
  }

  async unsubscribe(token: string): Promise<{ message: string }> {
    return this.subscriptionService.unsubscribe(token);
  }
}
