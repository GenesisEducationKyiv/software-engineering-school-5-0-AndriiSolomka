import { Test, TestingModule } from '@nestjs/testing';
import { WeatherService } from '../weather.service';
import { WeatherToken } from '../interfaces/weather.service.interface';

describe('WeatherHandlersService', () => {
  let service: WeatherService;
  const mockWeatherService = {
    getWeather: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        WeatherService,
        {
          provide: WeatherToken,
          useValue: mockWeatherService,
        },
      ],
    }).compile();

    service = moduleRef.get<WeatherService>(WeatherService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return cached weather if present', async () => {
    const city = 'Kyiv';
    const cachedWeather = { temp: 20, description: 'sunny' };

    mockWeatherService.getWeather.mockResolvedValue(cachedWeather);

    const result = await service.getWeather(city);

    expect(mockWeatherService.getWeather).toHaveBeenCalledWith(city);
    expect(result).toEqual(cachedWeather);
  });

  it('should fetch weather, cache it and return if not cached', async () => {
    const city = 'Lviv';
    const fetchedWeather = { temp: 15, description: 'cloudy' };

    mockWeatherService.getWeather.mockResolvedValue(fetchedWeather);

    const result = await service.getWeather(city);

    expect(mockWeatherService.getWeather).toHaveBeenCalledWith(city);
    expect(result).toEqual(fetchedWeather);
  });
});
