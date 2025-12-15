import { Inject, Injectable } from '@nestjs/common';
import {
  LoggerInterface,
  LoggerToken,
} from 'libs/core/logger/logger.interface';

import { SubscriptionService } from './subscription.service';
import { TokenService } from './token.service';
import {
  Frequency,
  SubscriptionEntity,
} from '../../core/entities/subscription.entity';
import { SubscriptionParams } from '../../core/subscription/subscription-repository.interface';

@Injectable()
export class SubscriptionApplicationService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly subClient: SubscriptionService,
    @Inject(LoggerToken)
    private readonly logger: LoggerInterface,
  ) {}

  async subscribe(
    params: SubscriptionParams,
  ): Promise<{ email: string; token: string }> {
    const subscription = await this.subClient.create(params);
    const token = await this.tokenService.create(subscription.subscriptionId);

    this.logger.info({
      msg: 'Subscription created',
      subscriptionId: subscription.subscriptionId,
      email: params.email,
    });

    return { email: params.email, token };
  }

  async confirm(token: string): Promise<{ message: string }> {
    const tokenEntity = await this.tokenService.getEntity(token);
    await this.subClient.confirm(tokenEntity.subscriptionId);

    this.logger.info({
      msg: 'Subscription confirmed',
      subscriptionId: tokenEntity.subscriptionId,
    });

    return { message: 'Subscription confirmed successfully' };
  }

  async unsubscribe(token: string): Promise<{ message: string }> {
    const tokenEntity = await this.tokenService.getEntity(token);
    await this.subClient.delete(tokenEntity.subscriptionId);

    this.logger.info({
      msg: 'Subscription deleted',
      subscriptionId: tokenEntity.subscriptionId,
    });

    return { message: 'Subscription deleted successfully' };
  }

  async getByFrequency(frequency: Frequency): Promise<SubscriptionEntity[]> {
    return this.subClient.getByFrequency(frequency);
  }

  async deleteUnconfirmed(): Promise<{ count: number }> {
    const result = await this.subClient.deleteUnconfirmed();

    this.logger.info({
      msg: 'Unconfirmed subscriptions deleted',
      count: result.count,
    });

    return result;
  }
}
