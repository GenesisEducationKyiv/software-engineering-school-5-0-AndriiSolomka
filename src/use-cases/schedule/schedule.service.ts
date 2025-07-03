import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Frequency } from 'src/core/entities/subscription.entity';
import { NotificationService } from 'src/use-cases/notification/notification.service';
import { SubscriptionDomainService } from 'src/use-cases/subscription/subscription-domain.service';

import { NOTIFICATION } from './constants/notification.enum';
import { SCHEDULE } from './constants/unconfirmed.enum';

@Injectable()
export class ScheduleService {
  constructor(
    private readonly subService: SubscriptionDomainService,
    private readonly notificationService: NotificationService,
  ) {}

  @Cron(SCHEDULE.DELETE_UNCONFIRMED_SUBSCRIPTIONS)
  async deleteUnconfirmedUsers(): Promise<void> {
    await this.subService.deleteUnconfirmed();
  }

  @Cron(NOTIFICATION.HOURLY)
  async sendHourlyWeatherUpdates(): Promise<void> {
    await this.notificationService.sendWeatherUpdates(Frequency.Hourly);
  }

  @Cron(NOTIFICATION.DAILY)
  async sendDailyWeatherUpdates(): Promise<void> {
    await this.notificationService.sendWeatherUpdates(Frequency.Daily);
  }
}
