import { CreateWeatherDto } from '../dto/create-weather.dto';

export interface IWeatherHandlersService {
  getWeather(city: string): Promise<CreateWeatherDto>;
}
