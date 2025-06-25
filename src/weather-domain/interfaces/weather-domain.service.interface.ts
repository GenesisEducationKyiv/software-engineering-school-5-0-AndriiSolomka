import {
  Location,
  WeatherApiResponse,
} from 'src/constants/types/weather/weather-client.interface';

export interface IWeatherDomainService {
  getCityWeather(city: string): Promise<WeatherApiResponse>;
  findCity(city: string): Promise<Location[]>;
}
