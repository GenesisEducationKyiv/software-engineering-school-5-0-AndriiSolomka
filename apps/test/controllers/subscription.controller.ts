import { Body, Controller, Get, Param, Post, UsePipes } from '@nestjs/common';
import { WeatherCityValidationPipe } from 'common/pipes/city-validation.pipe';
import { firstValueFrom } from 'rxjs';

import { SubscriptionGrpcClient } from './subscription.grpc.client';
import { CreateSubscriptionDto } from '../dto/subscription/subscription.dto';

@Controller()
export class SubscriptionHandlersController {
  constructor(private readonly grpcClient: SubscriptionGrpcClient) {}

  @UsePipes(WeatherCityValidationPipe)
  @Post('subscribe')
  async subscribe(@Body() dto: CreateSubscriptionDto) {
    const service = this.grpcClient.getService();
    return await firstValueFrom(service.Subscribe(dto));
  }

  @Get('confirm/:token')
  async confirm(@Param('token') token: string) {
    const service = this.grpcClient.getService();
    return await firstValueFrom(service.Confirm({ token }));
  }

  @Get('unsubscribe/:token')
  async unsubscribe(@Param('token') token: string) {
    const service = this.grpcClient.getService();
    return await firstValueFrom(service.Unsubscribe({ token }));
  }
}
