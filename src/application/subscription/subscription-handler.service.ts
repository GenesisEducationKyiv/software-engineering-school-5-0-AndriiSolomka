import { Injectable } from '@nestjs/common';
import { SubscriptionParams } from 'src/core/abstracts/subscription/subscription-repository.interface';

import { EmailService } from 'src/infrastructure/email/email.service';
import { SubscriptionDomainService } from 'src/use-cases/subscription/subscription-domain.service';
import { TokenService } from 'src/use-cases/token/token.service';

@Injectable()
export class SubscriptionHandlersService {
  constructor(
    private readonly subService: SubscriptionDomainService,
    private readonly tokenService: TokenService,
    private readonly mailService: EmailService,
  ) {}

  async subscribe(params: SubscriptionParams): Promise<{ message: string }> {
    const subscription = await this.subService.create(params);
    const token = await this.tokenService.create(subscription.subscription_id);
    await this.mailService.sendConfirmationEmail(params.email, token);
    return { message: 'Confirmation email sent' };
  }

  async confirm(token: string): Promise<{ message: string }> {
    const tokenEntity = await this.tokenService.getEntity(token);
    await this.subService.confirm(tokenEntity.subscription_id);
    return { message: 'Subscription confirmed successfully' };
  }

  async unsubscribe(token: string): Promise<{ message: string }> {
    const tokenEntity = await this.tokenService.getEntity(token);
    await this.subService.delete(tokenEntity.subscription_id);
    return { message: 'Subscription deleted successfully' };
  }
}
