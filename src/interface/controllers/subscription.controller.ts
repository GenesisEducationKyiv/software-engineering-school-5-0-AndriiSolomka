import { Body, Controller, Get, Param, Post, UsePipes } from '@nestjs/common';
import { CityValidationPipe } from 'src/common/pipes/city-validation.pipe';
import { CreateSubscriptionDto } from '../dto/subscription/subscription.dto';
import { SubscriptionHandlersService } from 'src/application/subscription/subscription-handler.service';

@Controller()
export class SubscriptionHandlersController {
  constructor(private readonly subscribeService: SubscriptionHandlersService) {}

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
