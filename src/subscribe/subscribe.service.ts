import { Injectable } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscribe.dto';
import { TokenService } from 'src/token/token.service';
import { EmailService } from 'src/email/email.service';
import { SubscriptionService } from 'src/subscription/subscription.service';
import { WeatherService } from 'src/weather/weather.service';

@Injectable()
export class SubscribeService {
  constructor(
    private readonly subService: SubscriptionService,
    private readonly tokenService: TokenService,
    private readonly mailService: EmailService,
    private readonly weatherService: WeatherService,
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
    return { message: 'Subscription confirmed' };
  }

  async unsubscribe(token: string): Promise<{ message: string }> {
    const tokenEntity = await this.tokenService.getEntity(token);
    await this.subService.delete(tokenEntity.subscription_id);
    return { message: 'Subscription delete successfully' };
  }
}
