import { Injectable } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscribe.dto';
import { TokenService } from 'src/token/token.service';
import { EmailService } from 'src/email/email.service';
import { SubscriptionService } from 'src/subscription/subscription.service';

@Injectable()
export class SubscribeService {
  constructor(
    private readonly subService: SubscriptionService,
    private readonly tokenService: TokenService,
    private readonly mailService: EmailService,
  ) {}

  async subscribe(dto: CreateSubscriptionDto): Promise<{ message: string }> {
    const subscription = await this.subService.createSubscription(dto);
    const token = await this.tokenService.createToken(
      subscription.subscription_id,
    );
    await this.mailService.sendConfirmationEmail(dto.email, token);
    return { message: 'Confirmation email sent' };
  }

  async confirm(token: string): Promise<{ message: string }> {
    const tokenEntity = await this.tokenService.getTokenEntity(token);
    await this.subService.confirmSubscription(tokenEntity.subscription_id);
    return { message: 'Subscription confirmed' };
  }

  async unsubscribe(token: string): Promise<{ message: string }> {
    const tokenEntity = await this.tokenService.getTokenEntity(token);
    await this.subService.deleteSubscription(tokenEntity.subscription_id);
    return { message: 'Subscription delete successfully' };
  }
}
