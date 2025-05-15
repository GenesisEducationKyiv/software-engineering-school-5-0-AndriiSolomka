import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { SubscriptionModule } from 'src/subscription/subscription.module';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [SubscriptionModule, NotificationModule],
  providers: [ScheduleService],
})
export class ScheduleModule {}
