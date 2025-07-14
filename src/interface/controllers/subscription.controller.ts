import { Body, Controller, Get, Param, Post, UsePipes } from '@nestjs/common';
import { WeatherCityValidationPipe } from 'src/common/pipes/city-validation.pipe';
import { SubscriptionApiClient } from 'src/infrastructure/subscription-management/application.client';
import { CreateSubscriptionDto } from 'src/interface/dto/subscription/subscription.dto';

@Controller()
export class SubscriptionHandlersController {
  constructor(private readonly subscribeService: SubscriptionApiClient) {}

  @UsePipes(WeatherCityValidationPipe)
  @Post('subscribe')
  async subscribe(@Body() dto: CreateSubscriptionDto) {
    return this.subscribeService.subscribe(dto);
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
