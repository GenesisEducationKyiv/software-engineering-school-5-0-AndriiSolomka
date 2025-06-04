import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { SubscriptionDomainModule } from 'src/subscription-domain/subscription-domain.module';
import { EmailModule } from 'src/email/email.module';
import { WeatherHandlersModule } from 'src/weather-handlers/weather-handlers.module';

@Module({
  imports: [SubscriptionDomainModule, EmailModule, WeatherHandlersModule],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
