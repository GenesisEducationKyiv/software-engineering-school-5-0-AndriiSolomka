import { Body, Controller, Inject, Post } from '@nestjs/common';
import { NotificationToken } from 'apps/weather_api/src/infrastructure/notification/core/notification.interface';

import { SendUpdatesDto } from './dto/notification.dto';
import { NotificationService } from '../../infrastructure/services/notification.service';

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
