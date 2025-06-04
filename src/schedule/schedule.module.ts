import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { SubscriptionDomainModule } from 'src/subscription-domain/subscription-domain.module';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [SubscriptionDomainModule, NotificationModule],
  providers: [ScheduleService],
})
export class ScheduleModule {}
