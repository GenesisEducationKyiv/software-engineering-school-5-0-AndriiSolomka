import { Module } from '@nestjs/common';
import { SubscriptionDomainModule } from './subscription-domain.module';
import { EmailModule } from './email.module';
import { WeatherModule } from './weather.module';
import { NotificationService } from 'src/use-cases/notification/notification.service';

@Module({
  imports: [SubscriptionDomainModule, EmailModule, WeatherModule],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
