import { CreateWeatherDto } from '../dto/create-weather.dto';

export interface WeatherInterface {
  getWeather(city: string): Promise<CreateWeatherDto>;
}

export const WeatherToken = Symbol('WeatherToken');
