import { WeatherData } from 'src/core/abstracts/weather/weather.interface';
import { SubscriptionEntity } from 'src/core/entities/subscription.entity';

const createWeatherEmailText = (
  city: string,
  temperature: number,
  humidity: number,
  description: string,
  unsubscribeLink: string,
): string => `
Weather forecast for ${city}:
🌡 Temperature: ${temperature}°C
💧 Humidity: ${humidity}%
☁️ Description: ${description}

If you wish to unsubscribe, click the link below:
${unsubscribeLink}
`;

export function buildWeatherNotification(
  sub: SubscriptionEntity,
  weather: WeatherData,
  unsubscribeUrl: string,
): { subject: string; text: string } {
  const token = sub.tokens[0].token;
  const city = sub.city;

  return {
    subject: `Weather forecast for ${city}`,
    text: createWeatherEmailText(
      city,
      weather.temperature,
      weather.humidity,
      weather.description,
      `${unsubscribeUrl}${token}`,
    ),
  };
}
