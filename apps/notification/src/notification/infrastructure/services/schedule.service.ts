import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Frequency } from 'apps/notification/src/subscription/core/subscription.interface';
import { SubscriptionClientService } from 'apps/notification/src/subscription/infrastructure/subscription.grpc.client';

import { NOTIFICATION } from './constants/notification.enum';
import { SCHEDULE } from './constants/unconfirmed.enum';
import { NotificationService } from './notification.service';

@Injectable()
export class ScheduleService {
  constructor(
    private readonly subService: SubscriptionClientService,
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
