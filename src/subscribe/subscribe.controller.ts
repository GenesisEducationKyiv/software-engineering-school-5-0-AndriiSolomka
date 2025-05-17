import { Body, Controller, Get, Param, Post, UsePipes } from '@nestjs/common';
import { SubscribeService } from './subscribe.service';
import { CreateSubscriptionDto } from './dto/create-subscribe.dto';
import { CityValidationPipe } from 'src/common/pipes/city-validation.pipe';
import { ApiDocs } from 'src/common/decorators/doc.decorator';
import { SUBSCRIBE_DOCS } from 'src/constants/documentation/subscribe/controller';

@Controller()
export class SubscribeController {
  constructor(private readonly subscribeService: SubscribeService) {}

  //@UsePipes(CityValidationPipe)
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
