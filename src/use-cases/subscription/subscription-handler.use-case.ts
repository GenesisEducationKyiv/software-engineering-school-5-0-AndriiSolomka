import { Injectable } from '@nestjs/common';
import { SubscriptionParams } from 'src/core/abstracts/subscription/subscription-repository.interface';
import { EmailApiClient } from 'src/infrastructure/api/services/email/email.service';
import { SubscriptionDomainUseCase } from 'src/use-cases/subscription/subscription-domain.use-case';
import { TokenUseCase } from 'src/use-cases/token/token.use-case';

@Injectable()
export class SubscriptionHandlersUseCase {
  constructor(
    private readonly subService: SubscriptionDomainUseCase,
    private readonly tokenService: TokenUseCase,
    private readonly emailClient: EmailApiClient,
  ) {}

  async subscribe(params: SubscriptionParams): Promise<{ message: string }> {
    const subscription = await this.subService.create(params);
    const token = await this.tokenService.create(subscription.subscriptionId);
    await this.emailClient.sendConfirmationEmail(params.email, token);
    return { message: 'Confirmation email sent' };
  }

  async confirm(token: string): Promise<{ message: string }> {
    const tokenEntity = await this.tokenService.getEntity(token);
    await this.subService.confirm(tokenEntity.subscriptionId);
    return { message: 'Subscription confirmed successfully' };
  }

  async unsubscribe(token: string): Promise<{ message: string }> {
    const tokenEntity = await this.tokenService.getEntity(token);
    await this.subService.delete(tokenEntity.subscriptionId);
    return { message: 'Subscription deleted successfully' };
  }
}
