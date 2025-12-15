import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { GrpcToObservable } from 'libs/common/types/observable';
import { firstValueFrom } from 'rxjs';

import {
  SUBSCRIPTION_PACKAGE,
  SubscribeParams,
  SubscriptionInterface,
} from '../core/subscription.interface';

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
    return await firstValueFrom(this.subscriptionService.subscribe(data));
  }

  async confirm(token: string): Promise<{ message: string }> {
    return await firstValueFrom(this.subscriptionService.confirm({ token }));
  }

  async unsubscribe(token: string): Promise<{ message: string }> {
    return await firstValueFrom(
      this.subscriptionService.unsubscribe({ token }),
    );
  }
}
