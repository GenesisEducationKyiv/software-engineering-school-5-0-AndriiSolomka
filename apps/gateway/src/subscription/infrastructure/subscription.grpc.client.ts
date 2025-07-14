/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';

import {
  SUBSCRIPTION_PACKAGE,
  SubscribeParams,
  SubscriptionInterface,
} from '../core/subscription.interface';

import type { GrpcToObservable } from 'libs/common/types/observable';

@Injectable()
export class SubscriptionClientService implements OnModuleInit {
  private subscriptionService: GrpcToObservable<SubscriptionInterface>;

  constructor(
    @Inject(SUBSCRIPTION_PACKAGE)
    private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.subscriptionService = this.client.getService<
      GrpcToObservable<SubscriptionInterface>
    >('SubscriptionService');
  }

  async subscribe(
    data: SubscribeParams,
  ): Promise<{ email: string; token: string }> {
    return await this.subscriptionService.subscribe(data).toPromise();
  }

  async confirm(token: string): Promise<{ message: string }> {
    return await this.subscriptionService.confirm(token).toPromise();
  }

  async unsubscribe(token: string): Promise<{ message: string }> {
    return await this.subscriptionService.unsubscribe(token).toPromise();
  }
}
