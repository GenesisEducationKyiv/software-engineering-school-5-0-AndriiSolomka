import { Body, Controller, Get, Param, Post, UsePipes } from '@nestjs/common';
import { CityValidationPipe } from 'src/common/pipes/city-validation.pipe';
import { HandlersApiClient } from 'src/infrastructure/subscription-management/application/api/clients/aplication.client';

import { CreateSubscriptionDto } from '../dto/subscription/subscription.dto';

@Controller()
export class SubscriptionHandlersController {
  constructor(private readonly subscribeService: HandlersApiClient) {}

  @UsePipes(CityValidationPipe)
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
