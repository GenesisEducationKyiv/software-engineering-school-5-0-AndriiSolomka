import { Module } from '@nestjs/common';
import { NotificationToken } from 'apps/weather_api/src/infrastructure/notification/core/notification.interface';
import { HttpClientModule } from 'libs/infrastructure/http/http-client.module';

import { InternalEmailModule } from '../email/email.module';
import { SubscriptionManagementModule } from '../subscription-management/subscription-management.module';
import { InternalWeatherModule } from '../weather/weather.module';
import { NotificationService } from './infrastructure/services/notification.service';
import { ScheduleService } from './infrastructure/services/schedule.service';
import { NotificationApiClient } from './interface/client/notification.client';
import { NotificationInternalController } from './interface/controllers/notification.controller';

@Module({
  imports: [
    HttpClientModule,
    InternalEmailModule,
    InternalWeatherModule,
    SubscriptionManagementModule,
  ],
  controllers: [NotificationInternalController],
  providers: [
    {
      provide: NotificationToken,
      useClass: NotificationService,
    },
    NotificationApiClient,
    ScheduleService,
  ],
  exports: [NotificationApiClient],
})
export class InternalNotificationModule {}
