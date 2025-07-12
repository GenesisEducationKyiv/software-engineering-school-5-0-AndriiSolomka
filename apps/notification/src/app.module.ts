import { ConfigifyModule } from '@itgorillaz/configify';
import { Module } from '@nestjs/common';
import { HttpClientModule } from 'libs/infrastructure/http/http-client.module';

import { NotificationService } from './infrastructure/services/notification.service';
import { ScheduleService } from './infrastructure/services/schedule.service';

@Module({
  imports: [ConfigifyModule.forRootAsync({}), HttpClientModule],
  providers: [NotificationService, ScheduleService],
})
export class AppModule {}
