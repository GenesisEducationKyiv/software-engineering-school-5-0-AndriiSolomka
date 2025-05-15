import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Frequency } from '@prisma/client';
import { NOTIFICATION } from 'src/constants/enums/schedule/notification.enum';
import { SCHEDULE } from 'src/constants/enums/schedule/unconfirmed.enum';
import { NotificationService } from 'src/notification/notification.service';
import { SubscriptionService } from 'src/subscription/subscription.service';

@Injectable()
export class ScheduleService {
  constructor(
    private readonly subService: SubscriptionService,
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
