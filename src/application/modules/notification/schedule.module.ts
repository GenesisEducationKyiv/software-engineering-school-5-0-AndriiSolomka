import { Module } from '@nestjs/common';
import { SubscriptionDomainModule } from '../subscription/subscription-domain.module';
import { NotificationModule } from './notification.module';
import { ScheduleService } from 'src/use-cases/schedule/schedule.service';

@Module({
  imports: [SubscriptionDomainModule, NotificationModule],
  providers: [ScheduleService],
})
export class ScheduleModule {}
