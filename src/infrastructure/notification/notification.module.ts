import { Module } from '@nestjs/common';
import { NotificationToken } from 'src/core/abstracts/notification/notification.interface';
import { HttpClientModule } from 'src/libs/http/http-client.module';

import { NotificationApiClient } from './api/client/notification.client';
import { NotificationService } from './services/notification.service';
import { InternalEmailModule } from '../email/email.module';
import { InternalWeatherModule } from '../weather/weather.module';
import { NotificationInternalController } from './api/controllers/notification.controller';
import { ScheduleService } from './services/schedule.service';
import { InternalHandlerModule } from '../subscription-management/application/handlers.module';

@Module({
  imports: [
    HttpClientModule,
    InternalEmailModule,
    InternalWeatherModule,
    InternalHandlerModule,
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
