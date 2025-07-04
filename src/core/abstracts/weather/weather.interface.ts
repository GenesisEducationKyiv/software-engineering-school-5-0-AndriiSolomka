export interface WeatherData {
  temperature: number;
  humidity: number;
  description: string;
}

export const WeatherToken = Symbol('WeatherToken');

export interface WeatherInterface {
  getWeather(city: string): Promise<WeatherData>;
}
