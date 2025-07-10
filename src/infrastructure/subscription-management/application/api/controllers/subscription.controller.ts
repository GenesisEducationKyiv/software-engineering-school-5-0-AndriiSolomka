import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import {
  SubscriptionCreateDto,
  SuccessResponseDto,
  TokenParamDto,
} from './dto/handlers.dto';
import { SubscriptionHandlersService } from '../../services/subscription-application.service';

@Controller('internal/subscription')
export class SubscriptionController {
  constructor(
    private readonly subscriptionHandlers: SubscriptionHandlersService,
  ) {}

  @Post()
  async subscribe(
    @Body() params: SubscriptionCreateDto,
  ): Promise<SuccessResponseDto> {
    return await this.subscriptionHandlers.subscribe(params);
  }

  @Get('confirm/:token')
  async confirm(
    @Param() { token }: TokenParamDto,
  ): Promise<SuccessResponseDto> {
    return await this.subscriptionHandlers.confirm(token);
  }

  @Post('unsubscribe/:token')
  async unsubscribe(
    @Param() { token }: TokenParamDto,
  ): Promise<SuccessResponseDto> {
    return await this.subscriptionHandlers.unsubscribe(token);
  }
}
