import { WeatherData } from 'src/core/abstracts/weather/weather.interface';
import { SubscriptionEntity } from 'src/core/entities/subscription.entity';
import {
  EMAIL_SUBJECTS,
  createWeatherEmailText,
} from 'src/infrastructure/email/constants/email.constants';

export function buildWeatherNotification(
  sub: SubscriptionEntity,
  weather: WeatherData,
): { subject: string; text: string } {
  const token = sub.tokens[0].token;

  const text = createWeatherEmailText({
    city: sub.city,
    temperature: weather.temperature,
    humidity: weather.humidity,
    description: weather.description,
    unsubscribeToken: token,
  });

  const subject = EMAIL_SUBJECTS.WEATHER_FORECAST(sub.city);
  return { subject, text };
}
