import { Module } from '@nestjs/common';
import { NotificationService } from 'src/use-cases/notification/notification.service';

import { EmailModule } from './email.module';
import { SubscriptionDomainModule } from '../subscription/subscription-domain.module';
import { WeatherModule } from '../weather/weather.module';

@Module({
  imports: [SubscriptionDomainModule, EmailModule, WeatherModule],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
