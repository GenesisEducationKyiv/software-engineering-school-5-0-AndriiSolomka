import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { GrpcToObservable } from 'libs/common/types/observable';
import { firstValueFrom } from 'rxjs';

import {
  Frequency,
  SUBSCRIPTION_PACKAGE,
  SubscriptionInterface,
} from '../../subscription/core/subscription.interface';
import { SubsWithToken } from '../core/subscription.entity';

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

  async getByFrequency(frequency: Frequency): Promise<SubsWithToken> {
    return firstValueFrom(
      this.subscriptionService.getByFrequency({ frequency }),
    );
  }

  async deleteUnconfirmed(): Promise<{ count: number }> {
    return firstValueFrom(this.subscriptionService.deleteUnconfirmed());
  }
}
