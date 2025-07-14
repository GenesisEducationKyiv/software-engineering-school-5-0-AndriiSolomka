import { Body, Controller, Inject, Post } from '@nestjs/common';
import { NotificationToken } from 'src/infrastructure/notification/core/notification.interface';
import { NotificationService } from 'src/infrastructure/notification/infrastructure/services/notification.service';

import { SendUpdatesDto } from './dto/notification.dto';

@Controller('internal/notification')
export class NotificationInternalController {
  constructor(
    @Inject(NotificationToken)
    private readonly notificationService: NotificationService,
  ) {}

  @Post('send-updates')
  async sendWeatherUpdates(@Body() { frequency }: SendUpdatesDto) {
    const result = await this.notificationService.sendWeatherUpdates(frequency);
    return result;
  }
}
