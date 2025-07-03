export interface WeatherEmailPayload {
  city: string;
  temperature: number;
  humidity: number;
  description: string;
  unsubscribeToken: string;
}

export enum EMAIL {
  CONFIRM_LINK = 'http://localhost:3000/api/confirm/',
  UNSUBSCRIBE_LINK = 'http://localhost:3000/api/unsubscribe/',
  SUBJECT = 'Subscription Confirmation',
  TEXT = 'Please confirm your Subscription by clicking the link:',
  CONFIRM_SUCCESS = 'Subscription successfully confirmed',
  SERVICE = 'gmail',
}

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
