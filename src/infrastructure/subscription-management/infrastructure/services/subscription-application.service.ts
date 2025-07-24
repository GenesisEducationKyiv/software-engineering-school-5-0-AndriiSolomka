import { Injectable } from '@nestjs/common';
import { EmailApiClient } from 'src/infrastructure/email/email.client';
import { SubscriptionParams } from 'src/infrastructure/subscription-management/core/subscription/subscription-repository.interface';

import { SubscriptionService } from './subscription.service';
import { TokenService } from './token.service';

@Injectable()
export class SubscriptionApplicationService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly subClient: SubscriptionService,
    private readonly emailClient: EmailApiClient,
  ) {}

  async subscribe(params: SubscriptionParams): Promise<{ message: string }> {
    const subscription = await this.subClient.create(params);
    const token = await this.tokenService.create(subscription.subscriptionId);
    await this.emailClient.sendConfirmationEmail(params.email, token);
    return { message: 'Confirmation email sent' };
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
}
