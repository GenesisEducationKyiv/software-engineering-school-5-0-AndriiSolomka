import { CacheWeatherService } from './cache-weather.service';
import { RedisRepository } from 'src/redis/redis.repository';
import { CreateWeatherDto } from 'src/weather/dto/create-weather.dto';
import { WEATHER_CASH } from 'src/constants/enums/redis/weather-cash.enum';
/* eslint-disable @typescript-eslint/unbound-method */

describe('CacheWeatherService', () => {
  let service: CacheWeatherService;
  let redis: RedisRepository;

  beforeEach(() => {
    redis = {
      get: jest.fn(),
      setWithExpiry: jest.fn(),
    } as Partial<RedisRepository> as RedisRepository;

    service = new CacheWeatherService(redis);
  });

  it('should return parsed weather data from cache', async () => {
    const city = 'Kyiv';
    const weatherData: CreateWeatherDto = {
      humidity: 20,
      temperature: 20,
      description: 'Sunny',
    };

    (redis.get as jest.Mock).mockResolvedValue(JSON.stringify(weatherData));

    const result = await service.get(city);

    expect(redis.get).toHaveBeenCalledWith(WEATHER_CASH.PREFIX, 'weather:kyiv');
    expect(result).toEqual(weatherData);
  });

  it('should return null if data not in cache', async () => {
    const city = 'Lviv';
    (redis.get as jest.Mock).mockResolvedValue(null);

    const result = await service.get(city);

    expect(redis.get).toHaveBeenCalledWith(WEATHER_CASH.PREFIX, 'weather:lviv');
    expect(result).toBeNull();
  });

  it('should set weather data in cache with expiry', async () => {
    const city = 'Odessa';
    const weatherData: CreateWeatherDto = {
      humidity: 20,
      temperature: 25,
      description: 'Cloudy',
    };

    await service.set(city, weatherData);

    expect(redis.setWithExpiry).toHaveBeenCalledWith(
      WEATHER_CASH.PREFIX,
      'weather:odessa',
      JSON.stringify(weatherData),
      WEATHER_CASH.TTL,
    );
  });
});
