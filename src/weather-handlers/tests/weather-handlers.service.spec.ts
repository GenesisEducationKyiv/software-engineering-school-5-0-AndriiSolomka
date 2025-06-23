import { WeatherHandlersService } from '../weather-handlers.service';
import { WeatherDomainService } from 'src/weather-domain/weather-domain.service';
import { CacheWeatherService } from 'src/cache-weather/cache-weather.service';
import { CreateWeatherDto } from '../dto/create-weather.dto';
import { WeatherApiResponse } from 'src/constants/types/weather/weather-client.interface';
import { IWeatherHandlersService } from '../interfaces/weather-handlers.service.interface';
import { Test } from '@nestjs/testing';

describe('WeatherHandlersService', () => {
  let service: IWeatherHandlersService;
  let clientMock: jest.Mocked<Pick<WeatherDomainService, 'getCityWeather'>>;
  let cacheMock: jest.Mocked<Pick<CacheWeatherService, 'get' | 'set'>>;

  beforeEach(async () => {
    clientMock = {
      getCityWeather: jest.fn<Promise<WeatherApiResponse>, [string]>(),
    };
    cacheMock = {
      get: jest.fn(),
      set: jest.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [
        WeatherHandlersService,
        {
          provide: WeatherDomainService,
          useValue: clientMock,
        },
        {
          provide: CacheWeatherService,
          useValue: cacheMock,
        },
      ],
    }).compile();

    service = module.get<WeatherHandlersService>(WeatherHandlersService);
  });

  it('should return cached weather if present', async () => {
    const city = 'Kyiv';
    const cached: CreateWeatherDto = {
      temperature: 20,
      humidity: 50,
      description: 'Sunny',
    };
    cacheMock.get.mockResolvedValueOnce(cached);

    const result = await service.getWeather(city);

    expect(cacheMock.get).toHaveBeenCalledWith(city);
    expect(result).toBe(cached);
    expect(clientMock.getCityWeather).not.toHaveBeenCalled();
    expect(cacheMock.set).not.toHaveBeenCalled();
  });

  it('should fetch weather, cache it and return if not cached', async () => {
    const city = 'Lviv';
    cacheMock.get.mockResolvedValueOnce(null);

    clientMock.getCityWeather.mockResolvedValueOnce({
      current: {
        temp_c: 15,
        humidity: 60,
        condition: { text: 'Cloudy' },
      },
    } as WeatherApiResponse);

    const expected = {
      temperature: 15,
      humidity: 60,
      description: 'Cloudy',
    };

    const result = await service.getWeather(city);

    expect(cacheMock.get).toHaveBeenCalledWith(city);
    expect(clientMock.getCityWeather).toHaveBeenCalledWith(city);
    expect(cacheMock.set).toHaveBeenCalledWith(city, expected);
    expect(result).toEqual(expected);
  });
});
