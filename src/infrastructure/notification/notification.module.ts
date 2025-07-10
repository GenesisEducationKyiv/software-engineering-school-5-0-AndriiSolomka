import { Module } from '@nestjs/common';
import { HttpClientModule } from 'src/application/modules/infrastructure/http-client.module';
import { NotificationToken } from 'src/core/abstracts/notification/notification.interface';

import { NotificationApiClient } from './api/client/notification.client';
import { NotificationService } from './services/notification.service';
import { InternalEmailModule } from '../email/email.module';
import { InternalSubscriptionModule } from '../subscription-management/subscription/subscription.module';
import { InternalWeatherModule } from '../weather/weather.module';
import { ScheduleService } from './services/schedule.service';
import { NotificationInternalController } from './api/controllers/notification.controller';

@Module({
  imports: [
    HttpClientModule,
    InternalSubscriptionModule,
    InternalEmailModule,
    InternalWeatherModule,
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
