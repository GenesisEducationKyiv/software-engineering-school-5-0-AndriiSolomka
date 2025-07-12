import { Injectable } from '@nestjs/common';

import { SubscriptionService } from './subscription.service';
import { TokenService } from './token.service';
import {
  Frequency,
  SubscriptionEntity,
} from '../../core/entities/subscription.entity';
import { SubscriptionParams } from '../../core/subscription/subscription-repository.interface';

@Injectable()
export class SubscriptionHandlersService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly subClient: SubscriptionService,
  ) {}

  async subscribe(
    params: SubscriptionParams,
  ): Promise<{ email: string; token: string }> {
    const subscription = await this.subClient.create(params);
    const token = await this.tokenService.create(subscription.subscriptionId);
    return { email: params.email, token };
  }

  async confirm(token: string): Promise<{ message: string }> {
    const tokenEntity = await this.tokenService.getEntity(token);
    await this.subClient.confirm(tokenEntity.subscriptionId);
    return { message: 'Subscription confirmed successfully' };
  }

  async unsubscribe(token: string): Promise<{ message: string }> {
    const tokenEntity = await this.tokenService.getEntity(token);
    await this.subClient.delete(tokenEntity.subscriptionId);
    return { message: 'Subscription deleted successfully' };
  }

  async getByFrequency(frequency: Frequency): Promise<SubscriptionEntity[]> {
    return this.subClient.getByFrequency(frequency);
  }

  async deleteUnconfirmed(): Promise<{ count: number }> {
    return this.subClient.deleteUnconfirmed();
  }
}
