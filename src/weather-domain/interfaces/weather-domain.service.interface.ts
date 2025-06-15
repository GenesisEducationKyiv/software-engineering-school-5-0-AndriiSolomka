import {
  ILocation,
  IWeatherApiResponse,
} from 'src/constants/types/weather/weather-client.interface';

export interface IWeatherDomainService {
  getCityWeather(city: string): Promise<IWeatherApiResponse>;
  findCity(city: string): Promise<ILocation[]>;
}
