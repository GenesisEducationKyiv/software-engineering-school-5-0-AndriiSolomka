import { Inject, Injectable } from '@nestjs/common';
import {
  EmailInterface,
  EmailToken,
} from 'src/core/abstracts/email/email.interface';
import { SubscriptionParams } from 'src/core/abstracts/subscription/subscription-repository.interface';
import { SubscriptionDomainUseCase } from 'src/use-cases/subscription/subscription-domain.use-case';
import { TokenUseCase } from 'src/use-cases/token/token.use-case';

@Injectable()
export class SubscriptionHandlersUseCase {
  constructor(
    private readonly subService: SubscriptionDomainUseCase,
    private readonly tokenService: TokenUseCase,
    @Inject(EmailToken)
    private readonly mailService: EmailInterface,
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
