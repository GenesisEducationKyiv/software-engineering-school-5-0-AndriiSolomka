import { Module } from '@nestjs/common';
import { ScheduleService } from 'src/use-cases/schedule/schedule.service';

import { NotificationModule } from './notification.module';
import { SubscriptionDomainModule } from '../subscription/subscription-domain.module';

@Module({
  imports: [SubscriptionDomainModule, NotificationModule],
  providers: [ScheduleService],
})
export class ScheduleModule {}
