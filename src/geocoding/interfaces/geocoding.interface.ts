import { GeocodingResponse } from 'src/constants/types/weather/weather-client.interface';

export type Coordinates = { latitude: number; longitude: number };

export interface GeocodingServiceInterface {
  findCity(city: string): Promise<GeocodingResponse>;
  getCityCoordinates(city: string): Promise<Coordinates>;
}

export const GeocodingToken = Symbol('GeocodingToken');
