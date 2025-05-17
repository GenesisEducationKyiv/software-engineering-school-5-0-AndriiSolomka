import { CityService } from './city.service';
import { WeatherApiClientService } from 'src/weather-api-client/weather-api-client.service';
import { CacheCityService } from 'src/cache-city/cache-city.service';
import { ILocation } from 'src/constants/types/weather/weather-client.interface';
/* eslint-disable @typescript-eslint/unbound-method */

describe('CityService', () => {
  let service: CityService;
  let client: WeatherApiClientService;
  let cache: CacheCityService;

  beforeEach(() => {
    client = {
      apiKey: '',
      baseUrl: '',
      fetch: jest.fn(),
      config: {},
      getCityWeather: jest.fn(),
      findCity: jest.fn(),
    } as unknown as WeatherApiClientService;

    cache = {
      get: jest.fn(),
      set: jest.fn(),
      redis: {},
      getKey: jest.fn((city: string) => `city:${city}`),
    } as unknown as CacheCityService;

    service = new CityService(client, cache);
  });

  it('should return cached city locations if available', async () => {
    const city = 'Kyiv';
    const cachedData: ILocation[] = [
      {
        id: 1,
        name: 'Kyiv',
        country: 'UA',
        region: 'Kyiv City',
        lat: 50.45,
        lon: 30.52,
        url: 'kyiv-ua',
      },
    ];

    (cache.get as jest.Mock).mockResolvedValue(cachedData);

    const result = await service.checkCityLocations(city);

    expect(result).toEqual(cachedData);
    expect(cache.get).toHaveBeenCalledWith(city);
    expect(client.findCity).not.toHaveBeenCalled();
  });

  it('should fetch and cache city locations if not cached', async () => {
    const city = 'Lviv';
    const fetchedData: ILocation[] = [
      {
        id: 2,
        name: 'Lviv',
        country: 'UA',
        region: 'Lviv Oblast',
        lat: 49.84,
        lon: 24.03,
        url: 'lviv-ua',
      },
    ];

    (cache.get as jest.Mock).mockResolvedValue(null);
    (client.findCity as jest.Mock).mockResolvedValue(fetchedData);

    const result = await service.checkCityLocations(city);

    expect(cache.get).toHaveBeenCalledWith(city);
    expect(client.findCity).toHaveBeenCalledWith(city);
    expect(cache.set).toHaveBeenCalledWith(city, fetchedData);
    expect(result).toEqual(fetchedData);
  });
});
