import { Injectable } from '@nestjs/common';
import { SubscriptionParams } from 'src/core/abstracts/subscription/subscription-repository.interface';
import { EmailApiClient } from 'src/infrastructure/email/interface/clients/email.client';

import { SubscriptionService } from '../../subscription/services/subscription.service';
import { TokenService } from '../../token/services/token.service';

@Injectable()
export class SubscriptionHandlersService {
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
