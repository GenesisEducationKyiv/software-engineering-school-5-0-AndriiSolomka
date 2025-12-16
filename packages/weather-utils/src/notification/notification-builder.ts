export interface WeatherData {
  temperature: number;
  humidity: number;
  description: string;
}

export interface Subscription {
  city: string;
  tokens: Array<{ token: string }>;
}

export interface NotificationTemplate {
  subject: string;
  text: string;
}

export interface NotificationBuilderConfig {
  unsubscribeBaseUrl: string;
}

/**
 * Creates weather email notification text
 * @param city - City name
 * @param temperature - Temperature in Celsius
 * @param humidity - Humidity percentage
 * @param description - Weather description
 * @param unsubscribeLink - Full unsubscribe link
 * @returns Formatted email text
 */
export function createWeatherEmailText(
  city: string,
  temperature: number,
  humidity: number,
  description: string,
  unsubscribeLink: string,
): string {
  return `
Weather forecast for ${city}:
🌡 Temperature: ${temperature}°C
💧 Humidity: ${humidity}%
☁️ Description: ${description}

If you wish to unsubscribe, click the link below:
${unsubscribeLink}
`;
}

/**
 * Builds a weather notification from subscription and weather data
 * @param subscription - Subscription entity
 * @param weather - Weather data
 * @param unsubscribeUrl - Base unsubscribe URL
 * @returns Notification template with subject and text
 */
export function buildWeatherNotification(
  subscription: Subscription,
  weather: WeatherData,
  unsubscribeUrl: string,
): NotificationTemplate {
  const token = subscription.tokens[0]?.token;
  const city = subscription.city;

  if (!token) {
    throw new Error('Subscription must have at least one token');
  }

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

/**
 * Builder class for creating notifications with configuration
 */
export class NotificationBuilder {
  constructor(private readonly config: NotificationBuilderConfig) {}

  /**
   * Build weather notification
   */
  buildWeatherNotification(
    subscription: Subscription,
    weather: WeatherData,
  ): NotificationTemplate {
    return buildWeatherNotification(
      subscription,
      weather,
      this.config.unsubscribeBaseUrl,
    );
  }
}
