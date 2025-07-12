import { Inject, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { NotificationToken } from 'apps/notification/src/core/notification.interface';

import { NOTIFICATION } from './constants/notification.enum';
import { SCHEDULE } from './constants/unconfirmed.enum';
import { NotificationService } from './notification.service';
import { Frequency } from '../../core/subscription.interface';
import { SubscriptionClientService } from '../clients/subscription.client';

@Injectable()
export class ScheduleService {
  constructor(
    private readonly subService: SubscriptionClientService,
    @Inject(NotificationToken)
    private readonly notificationService: NotificationService,
  ) {}

  @Cron(SCHEDULE.DELETE_UNCONFIRMED_SUBSCRIPTIONS)
  async deleteUnconfirmedUsers(): Promise<void> {
    await this.subService.deleteUnconfirmed();
  }

  @Cron(NOTIFICATION.HOURLY)
  async sendHourlyWeatherUpdates(): Promise<void> {
    await this.notificationService.sendWeatherUpdates(Frequency.hourly);
  }

  @Cron(NOTIFICATION.DAILY)
  async sendDailyWeatherUpdates(): Promise<void> {
    await this.notificationService.sendWeatherUpdates(Frequency.daily);
  }
}
