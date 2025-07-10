import { Test, TestingModule } from '@nestjs/testing';
import { WeatherInterface } from 'src/infrastructure/weather/core/weather.interface';
import { WeatherFactory } from 'src/infrastructure/weather/weather.factory';

describe('WeatherUseCase', () => {
  let service: WeatherInterface;
  const mockWeatherService = {
    getWeather: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        WeatherFactory,
        {
          provide: WeatherFactory,
          useValue: mockWeatherService,
        },
      ],
    }).compile();

    service = moduleRef.get<WeatherInterface>(WeatherFactory);
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
