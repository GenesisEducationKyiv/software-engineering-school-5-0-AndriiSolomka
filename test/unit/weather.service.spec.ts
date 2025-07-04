import { Test, TestingModule } from '@nestjs/testing';
import { WeatherUseCase } from 'src/use-cases/weather-updates/get-weather.use-case';

describe('WeatherHandlersService', () => {
  let service: WeatherUseCase;
  const mockWeatherService = {
    getWeather: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        WeatherUseCase,
        {
          provide: WeatherUseCase,
          useValue: mockWeatherService,
        },
      ],
    }).compile();

    service = moduleRef.get<WeatherUseCase>(WeatherUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return  weather if present', async () => {
    const city = 'Kyiv';
    const cachedWeather = { temp: 20, description: 'sunny' };

    mockWeatherService.getWeather.mockResolvedValue(cachedWeather);

    const result = await service.getWeather(city);

    expect(mockWeatherService.getWeather).toHaveBeenCalledWith(city);
    expect(result).toEqual(cachedWeather);
  });
});
