import { Frequency } from 'src/core/entities/subscription.entity';

export interface EmailSenderInterface {
  sendWeatherUpdates(frequency: Frequency): Promise<void>;
}
