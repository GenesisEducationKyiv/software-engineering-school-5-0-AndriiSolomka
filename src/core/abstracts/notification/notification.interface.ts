import { Frequency } from 'src/core/entities/subscription.entity';

export const NotificationToken = Symbol('NotificationToken');

export interface NotificationInterface {
  sendWeatherUpdates(frequency: Frequency): Promise<void>;
}
