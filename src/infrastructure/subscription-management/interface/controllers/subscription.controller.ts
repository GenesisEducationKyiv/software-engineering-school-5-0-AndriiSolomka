import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CityValidationPipe } from 'src/common/pipes/city-validation.pipe';
import {
  Frequency,
  SubscriptionEntity,
} from 'src/infrastructure/subscription-management/core/entities/subscription.entity';
import { SubscriptionService } from 'src/infrastructure/subscription-management/infrastructure/services/subscription.service';

import {
  SubscriptionCreateDto,
  SuccessResponseDto,
  TokenParamDto,
} from './dto/handlers.dto';
import { SubscriptionHandlersService } from '../../infrastructure/services/subscription-application.service';

@Controller('internal/subscription')
export class SubscriptionController {
  constructor(
    private readonly subscriptionHandlers: SubscriptionHandlersService,
    private readonly subscriptionService: SubscriptionService,
  ) {}

  @Post()
  async subscribe(
    @Body('city', CityValidationPipe) city: string,
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
