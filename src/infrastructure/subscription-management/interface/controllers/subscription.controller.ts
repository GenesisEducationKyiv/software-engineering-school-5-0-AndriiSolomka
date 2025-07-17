import { Body, Controller, Get, Param, Post, UsePipes } from '@nestjs/common';
import {
  Frequency,
  SubscriptionEntity,
} from 'src/infrastructure/subscription-management/core/entities/subscription.entity';
import { SubscriptionHandlersService } from 'src/infrastructure/subscription-management/infrastructure/services/subscription-application.service';
import { SubscriptionService } from 'src/infrastructure/subscription-management/infrastructure/services/subscription.service';

import {
  SubscriptionCreateDto,
  SuccessResponseDto,
  TokenParamDto,
} from './dto/handlers.dto';
import { SubscriptionCityValidationPipe } from 'src/common/pipes/subscription-city.validation.pipe';

@Controller('internal/subscription')
export class SubscriptionController {
  constructor(
    private readonly subscriptionHandlers: SubscriptionHandlersService,
    private readonly subscriptionService: SubscriptionService,
  ) {}

  @Post()
  @UsePipes(SubscriptionCityValidationPipe)
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

  @Post('delete-unconfirmed')
  async deleteUnconfirmed(): Promise<{ count: number }> {
    return await this.subscriptionService.deleteUnconfirmed();
  }

  @Get('by-frequency/:frequency')
  async getByFrequency(
    @Param('frequency') frequency: Frequency,
  ): Promise<SubscriptionEntity[]> {
    return await this.subscriptionService.getByFrequency(frequency);
  }
}
