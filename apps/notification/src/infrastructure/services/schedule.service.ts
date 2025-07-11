import { Inject, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { NotificationToken } from 'apps/notification/src/core/notification.interface';
import { Frequency } from 'apps/subscription/src/core/entities/subscription.entity';
import { SubscriptionApiClient } from 'apps/subscription/src/interface/clients/application.client';

import { NOTIFICATION } from './constants/notification.enum';
import { SCHEDULE } from './constants/unconfirmed.enum';
import { NotificationService } from './notification.service';

@Injectable()
export class ScheduleService {
  constructor(
    private readonly subService: SubscriptionApiClient,
    @Inject(NotificationToken)
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
