import { Frequency } from 'apps/subscription/src/core/entities/subscription.entity';

export const NotificationToken = Symbol('NotificationToken');

export interface NotificationInterface {
  sendWeatherUpdates(frequency: Frequency): Promise<void>;
}
