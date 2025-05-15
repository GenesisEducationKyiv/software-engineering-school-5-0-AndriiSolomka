import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { SubscriptionModule } from 'src/subscription/subscription.module';
import { EmailModule } from 'src/email/email.module';
import { WeatherModule } from 'src/weather/weather.module';

@Module({
  imports: [SubscriptionModule, EmailModule, WeatherModule],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
