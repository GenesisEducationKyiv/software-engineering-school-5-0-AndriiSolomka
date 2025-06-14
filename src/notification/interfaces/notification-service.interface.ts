import { Frequency } from '@prisma/client';

export interface INotificationService {
  sendWeatherUpdates(frequency: Frequency): Promise<void>;
}
