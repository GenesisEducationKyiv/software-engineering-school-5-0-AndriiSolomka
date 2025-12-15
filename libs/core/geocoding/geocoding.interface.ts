export type Coordinates = {
  latitude: number;
  longitude: number;
};

export type City = {
  id: number;
  name: string;
  coordinates: Coordinates;
  country: string;
};

export interface GeocodingInterface {
  findCity(cityName: string): Promise<City>;
  getCityCoordinates(city: string): Promise<Coordinates>;
}
