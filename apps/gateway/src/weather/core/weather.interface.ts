export const WEATHER_PACKAGE = Symbol('WEATHER_PACKAGE');

export interface WeatherData {
  temperature: number;
  humidity: number;
  description: string;
}

export interface WeatherInterface {
  getWeather(request: { city: string }): Promise<WeatherData>;
}
