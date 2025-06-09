import { Injectable } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { TokenService } from 'src/token/token.service';
import { EmailService } from 'src/email/email.service';
import { SubscriptionDomainService } from 'src/subscription-domain/subscription-domain.service';

@Injectable()
export class SubscriptionHandlersService {
  constructor(
    private readonly subService: SubscriptionDomainService,
    private readonly tokenService: TokenService,
    private readonly mailService: EmailService,
  ) {}

  async subscribe(dto: CreateSubscriptionDto): Promise<{ message: string }> {
    const subscription = await this.subService.create(dto);
    const token = await this.tokenService.create(subscription.subscription_id);
    await this.mailService.sendConfirmationEmail(dto.email, token);
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
