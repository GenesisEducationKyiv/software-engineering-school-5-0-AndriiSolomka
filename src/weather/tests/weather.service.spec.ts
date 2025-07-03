import { Test, TestingModule } from '@nestjs/testing';
import { WeatherService } from '../weather.service';

describe('WeatherHandlersService', () => {
  let service: WeatherService;
  const mockWeatherService = {
    getWeather: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: WeatherService,
          useValue: mockWeatherService,
        },
      ],
    }).compile();

    service = moduleRef.get<WeatherService>(WeatherService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return weather if present', async () => {
    const city = 'Kyiv';
    const cachedWeather = { temp: 20, description: 'sunny' };

    mockWeatherService.getWeather.mockResolvedValue(cachedWeather);

    const result = await service.getWeather(city);

    expect(mockWeatherService.getWeather).toHaveBeenCalledWith(city);
    expect(result).toEqual(cachedWeather);
  });
});
