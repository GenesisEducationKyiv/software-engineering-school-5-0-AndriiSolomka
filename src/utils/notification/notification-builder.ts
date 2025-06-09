import {
  createWeatherEmailText,
  EMAIL_SUBJECTS,
} from 'src/constants/email-templates/weather-email.template';
import { SubWithTokens } from 'src/constants/types/prisma/subscription.type';
import { CreateWeatherDto } from 'src/weather-handlers/dto/create-weather.dto';

export function buildWeatherNotification(
  sub: SubWithTokens,
  weather: CreateWeatherDto,
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
