import { Body, Controller, Get, Param, Post, UsePipes } from '@nestjs/common';
import { WeatherCityValidationPipe } from 'common/pipes/city-validation.pipe';

import { CreateSubscriptionDto } from './dto/subscription/subscription.dto';
import { EmailClientService } from '../../email/infrastructure/email.grcp.client';
import { SubscriptionClientService } from '../infrastructure/subscription.grpc.client';

@Controller()
export class SubscriptionHandlersController {
  constructor(
    private readonly subscribeService: SubscriptionClientService,
    private readonly emailClient: EmailClientService,
  ) {}

  //@UsePipes(WeatherCityValidationPipe)
  @Post('subscribe')
  async subscribe(@Body() dto: CreateSubscriptionDto) {
    const { email, token } = await this.subscribeService.subscribe(dto);
    console.log(`Subscription created for email: ${email}, token: ${token}`);

    if (email && token)
      return await this.emailClient.sendConfirmationEmail(email, token);
  }

  @Get('confirm/:token')
  async confirm(@Param('token') token: string) {
    return this.subscribeService.confirm(token);
  }

  @Get('unsubscribe/:token')
  async unsubscribe(@Param('token') token: string) {
    return this.subscribeService.unsubscribe(token);
  }
}
