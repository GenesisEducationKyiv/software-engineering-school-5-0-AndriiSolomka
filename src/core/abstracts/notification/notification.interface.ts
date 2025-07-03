import { Frequency } from 'src/core/entities/subscription.entity';

export interface NotificationInterface {
  sendWeatherUpdates(frequency: Frequency): Promise<void>;
}
