import { Frequency } from './subscription.interface';

export const NotificationToken = Symbol('NotificationToken');

export interface NotificationInterface {
  sendWeatherUpdates(frequency: Frequency): Promise<void>;
}
