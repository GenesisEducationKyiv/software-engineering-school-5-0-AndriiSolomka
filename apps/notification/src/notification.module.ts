import { Module } from '@nestjs/common';
import { InternalEmailModule } from 'apps/email/email.module';
import { NotificationToken } from 'apps/notification/src/core/notification.interface';
import { SubscriptionManagementModule } from 'apps/subscription/src/subscription.module';
import { WeatherAppModule } from 'apps/weather/src/weather.module';
import { HttpClientModule } from 'libs/infrastructure/http/http-client.module';

import { NotificationService } from './infrastructure/services/notification.service';
import { ScheduleService } from './infrastructure/services/schedule.service';
import { NotificationApiClient } from './interface/client/notification.client';
import { NotificationInternalController } from './interface/controllers/notification.controller';

@Module({
  imports: [
    HttpClientModule,
    InternalEmailModule,
    WeatherAppModule,
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
