import { Test, TestingModule } from '@nestjs/testing';
import { WeatherService } from './weather.service';
import { WeatherApiClientService } from '../weather-api-client/weather-api-client.service';
import { CacheWeatherService } from 'src/cache-weather/cache-weather.service';
import { CreateWeatherDto } from './dto/create-weather.dto';

describe('WeatherService', () => {
  let service: WeatherService;

  const mockApiResponse = {
    current: {
      temp_c: 20,
      humidity: 50,
      condition: {
        text: 'Sunny',
      },
    },
  };

  const expectedWeather: CreateWeatherDto = {
    temperature: 20,
    humidity: 50,
    description: 'Sunny',
  };

  const mockCacheService = {
    get: jest.fn(),
    set: jest.fn(),
  };

  const mockWeatherApiClientService = {
    getCityWeather: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WeatherService,
        {
          provide: WeatherApiClientService,
          useValue: mockWeatherApiClientService,
        },
        { provide: CacheWeatherService, useValue: mockCacheService },
      ],
    }).compile();

    service = module.get<WeatherService>(WeatherService);
    service = module.get<WeatherService>(WeatherService);
    service = module.get<WeatherService>(WeatherService);
    jest.clearAllMocks();
  });

  it('should return cached weather data if available', async () => {
    mockCacheService.get.mockResolvedValueOnce(expectedWeather);
    const result = await service.getWeather('Kyiv');

    expect(mockCacheService.get).toHaveBeenCalledWith('Kyiv');
    expect(mockWeatherApiClientService.getCityWeather).not.toHaveBeenCalled();
    expect(result).toEqual(expectedWeather);
  });

  it('should fetch weather data, cache it, and return it if not cached', async () => {
    mockCacheService.get.mockResolvedValueOnce(null);
    mockWeatherApiClientService.getCityWeather.mockResolvedValueOnce(
      mockApiResponse,
    );
    const result = await service.getWeather('Lviv');
    expect(mockCacheService.get).toHaveBeenCalledWith('Lviv');
    expect(mockWeatherApiClientService.getCityWeather).toHaveBeenCalledWith(
      'Lviv',
    );
    expect(mockCacheService.set).toHaveBeenCalledWith('Lviv', expectedWeather);
    expect(result).toEqual(expectedWeather);
  });
});
