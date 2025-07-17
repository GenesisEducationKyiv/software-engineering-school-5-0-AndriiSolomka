import { Module } from '@nestjs/common';
import { HttpClientModule } from 'libs/infrastructure/http/http-client.module';

import { EmailModule } from '../email/email.module';
import { SubscriptionModule } from '../subscription/subscription.module';
import { WeatherModule } from '../weather/weather.module';
import { NotificationService } from './infrastructure/services/notification.service';
import { ScheduleService } from './infrastructure/services/schedule.service';

@Module({
  imports: [HttpClientModule, WeatherModule, SubscriptionModule, EmailModule],
  providers: [NotificationService, ScheduleService],
  exports: [NotificationService],
})
export class NotificationModule {}
