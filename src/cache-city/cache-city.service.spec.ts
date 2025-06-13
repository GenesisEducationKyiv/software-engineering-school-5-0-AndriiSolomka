import { CacheCityService } from './cache-city.service';
import { RedisRepository } from 'src/redis/redis.repository';
import { ILocation } from 'src/constants/types/weather/weather-client.interface';
import { CITY_CASH } from 'src/constants/enums/cache/city-cash.enum';
/* eslint-disable @typescript-eslint/unbound-method */

describe('CacheCityService', () => {
  let service: CacheCityService;
  let redis: RedisRepository;

  beforeEach(() => {
    redis = {
      get: jest.fn(),
      setWithExpiry: jest.fn(),
    } as Partial<RedisRepository> as RedisRepository;

    service = new CacheCityService(redis);
  });

  it('should return parsed location data from cache', async () => {
    const city = 'Kyiv';
    const locationData: ILocation[] = [
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

    (redis.get as jest.Mock).mockResolvedValue(JSON.stringify(locationData));

    const result = await service.get(city);

    expect(redis.get).toHaveBeenCalledWith(CITY_CASH.PREFIX, 'location:kyiv');
    expect(result).toEqual(locationData);
  });

  it('should return null if no data in cache', async () => {
    const city = 'Lviv';
    (redis.get as jest.Mock).mockResolvedValue(null);

    const result = await service.get(city);

    expect(redis.get).toHaveBeenCalledWith(CITY_CASH.PREFIX, 'location:lviv');
    expect(result).toBeNull();
  });

  it('should set location data in cache with expiry', async () => {
    const city = 'Odesa';
    const locationData: ILocation[] = [
      {
        id: 3,
        name: 'Odesa',
        country: 'UA',
        region: 'Odesa Oblast',
        lat: 46.48,
        lon: 30.73,
        url: 'odesa-ua',
      },
    ];

    await service.set(city, locationData);

    expect(redis.setWithExpiry).toHaveBeenCalledWith(
      CITY_CASH.PREFIX,
      'location:odesa',
      JSON.stringify(locationData),
      CITY_CASH.TTL,
    );
  });
});
