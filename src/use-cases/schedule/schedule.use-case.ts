import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Frequency } from 'src/core/entities/subscription.entity';
import { SubscriptionApiClient } from 'src/infrastructure/subscription-management/clients/subscription-api.client';

import { NOTIFICATION } from './constants/notification.enum';
import { SCHEDULE } from './constants/unconfirmed.enum';
import { SendWeatherUpdatesUseCase } from '../weather-updates/weather-updates.use-case';

@Injectable()
export class ScheduleUseCase {
  constructor(
    private readonly subService: SubscriptionApiClient,
    private readonly notificationService: SendWeatherUpdatesUseCase,
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
