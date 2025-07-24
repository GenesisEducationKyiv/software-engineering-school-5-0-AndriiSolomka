import { Module } from '@nestjs/common';
import { InternalEmailModule } from 'src/infrastructure/email/email.module';
import { NotificationToken } from 'src/infrastructure/notification/core/notification.interface';
import { SubscriptionManagementModule } from 'src/infrastructure/subscription-management/subscription-management.module';
import { InternalWeatherModule } from 'src/infrastructure/weather/weather.module';
import { HttpClientModule } from 'src/libs/infrastructure/http/http-client.module';

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
