import { Frequency } from 'apps/weather_api/src/infrastructure/subscription-management/core/entities/subscription.entity';

export const NotificationToken = Symbol('NotificationToken');

export interface NotificationInterface {
  sendWeatherUpdates(frequency: Frequency): Promise<void>;
}
