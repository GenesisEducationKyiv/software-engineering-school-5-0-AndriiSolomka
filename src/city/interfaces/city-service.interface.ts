import { ILocation } from 'src/constants/types/weather/weather-client.interface';

export interface ICityService {
  checkCityLocations(city: string): Promise<ILocation[]>;
}
