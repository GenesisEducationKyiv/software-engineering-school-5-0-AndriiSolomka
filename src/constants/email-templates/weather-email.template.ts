import { EMAIL } from 'src/constants/enums/email/email.enum';
import { WeatherEmailPayload } from '../types/weather/weather-email.interface';

export const createWeatherEmailText = ({
  city,
  temperature,
  humidity,
  description,
  unsubscribeToken,
}: WeatherEmailPayload): string => {
  return `
Weather forecast for ${city}:
🌡 Temperature: ${temperature}°C
💧 Humidity: ${humidity}%
☁️ Description: ${description}

If you wish to unsubscribe, click the link below:
${EMAIL.UNSUBSCRIBE_LINK}${unsubscribeToken}
  `;
};

export const EMAIL_SUBJECTS = {
  WEATHER_FORECAST: (city: string) => `Weather forecast for ${city}`,
};
