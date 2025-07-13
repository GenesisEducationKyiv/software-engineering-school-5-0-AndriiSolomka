import { Module } from '@nestjs/common';
import { NotificationToken } from 'src/infrastructure/notification/core/notification.interface';
import { HttpClientModule } from 'src/libs/infrastructure/http/http-client.module';

import { InternalEmailModule } from '../email/email.module';
import { SubscriptionManagementModule } from '../subscription-management/subscription-management.module';
import { InternalWeatherModule } from '../weather/weather.module';
import { NotificationService } from './infrastructure/services/notification.service';
import { ScheduleService } from './infrastructure/services/schedule.service';
import { NotificationInternalController } from './interface/controllers/notification.controller';
import { NotificationApiClient } from './notification.client';

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
