import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { SubscriptionDomainModule } from 'src/subscription-domain/subscription-domain.module';
import { EmailModule } from 'src/email/email.module';
import { WeatherModule } from 'src/weather/weather.module';

@Module({
  imports: [SubscriptionDomainModule, EmailModule, WeatherModule],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
