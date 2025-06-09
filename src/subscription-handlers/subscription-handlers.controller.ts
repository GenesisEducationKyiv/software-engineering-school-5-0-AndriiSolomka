import { Body, Controller, Get, Param, Post, UsePipes } from '@nestjs/common';
import { SubscriptionHandlersService } from './subscription-handlers.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { CityValidationPipe } from 'src/common/pipes/city-validation.pipe';
import { ApiDocs } from 'src/common/decorators/doc.decorator';
import { SUBSCRIBE_DOCS } from 'src/constants/documentation/subscribe/controller';

@Controller()
export class SubscriptionHandlersController {
  constructor(private readonly subscribeService: SubscriptionHandlersService) {}

  @UsePipes(CityValidationPipe)
  @ApiDocs(SUBSCRIBE_DOCS.subscribe)
  @Post('subscribe')
  async subscribe(@Body() dto: CreateSubscriptionDto) {
    return this.subscribeService.subscribe(dto);
  }

  @ApiDocs(SUBSCRIBE_DOCS.confirm)
  @Get('confirm/:token')
  async confirm(@Param('token') token: string) {
    return this.subscribeService.confirm(token);
  }

  @ApiDocs(SUBSCRIBE_DOCS.unsubscribe)
  @Get('unsubscribe/:token')
  async unsubscribe(@Param('token') token: string) {
    return this.subscribeService.unsubscribe(token);
  }
}
