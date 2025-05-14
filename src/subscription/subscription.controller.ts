import { Body, Controller, Post } from '@nestjs/common';
import { CreateSubscribeDto } from './dto/create-subscribe.dto';
import { SubscriptionService } from './subscription.service';

@Controller()
export class SubscriptionController {
  constructor(private readonly subscribeService: SubscriptionService) {}

  @Post('/subscribe')
  async subscribe(@Body() dto: CreateSubscribeDto) {
    return await this.subscribeService.subscribe(dto);
  }
}
