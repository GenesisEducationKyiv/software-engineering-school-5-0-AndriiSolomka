export interface IScheduleService {
  deleteUnconfirmedUsers(): Promise<void>;
  sendHourlyWeatherUpdates(): Promise<void>;
  sendDailyWeatherUpdates(): Promise<void>;
}
