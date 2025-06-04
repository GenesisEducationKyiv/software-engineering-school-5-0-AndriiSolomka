export interface WeatherEmailPayload {
  city: string;
  temperature: number;
  humidity: number;
  description: string;
  unsubscribeToken: string;
}
