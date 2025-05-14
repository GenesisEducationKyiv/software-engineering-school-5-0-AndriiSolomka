import { Test, TestingModule } from '@nestjs/testing';
import { WeatherService } from './weather.service';
import { WeatherApiClientService } from '../weather-api-client/weather-api-client.service';

describe('WeatherService', () => {
  let service: WeatherService;
  let client: WeatherApiClientService;

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
      ],
    }).compile();

    service = module.get<WeatherService>(WeatherService);
    client = module.get<WeatherApiClientService>(WeatherApiClientService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return filtered weather data', async () => {
    const mockApiResponse = {
      current: {
        temp_c: 22,
        humidity: 55,
        condition: { text: 'Partly cloudy' },
      },
    };
    (client.getCityWeather as jest.Mock).mockResolvedValueOnce(mockApiResponse);

    const result = await service.getWeather('Paris');
    expect(result).toEqual({
      temperature: 22,
      humidity: 55,
      description: 'Partly cloudy',
    });
    expect(mockWeatherApiClientService.getCityWeather).toHaveBeenCalledWith(
      'Paris',
    );
  });
});
