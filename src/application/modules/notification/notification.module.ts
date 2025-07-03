import { Module } from '@nestjs/common';
import { EmailModule } from './email.module';
import { NotificationService } from 'src/use-cases/notification/notification.service';
import { WeatherModule } from '../weather/weather.module';
import { SubscriptionDomainModule } from '../subscription/subscription-domain.module';

@Module({
  imports: [SubscriptionDomainModule, EmailModule, WeatherModule],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
