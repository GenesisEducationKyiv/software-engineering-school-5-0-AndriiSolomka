import { Test, TestingModule } from '@nestjs/testing';
import { WeatherApiClientService } from './weather-api-client.service';
import { ConfigService } from '@nestjs/config';
import { FetchService } from '../fetch/fetch.service';

describe('WeatherApiClientService', () => {
  let service: WeatherApiClientService;
  let fetchService: FetchService;

  const mockConfigService = {
    get: jest.fn((key: string) => {
      if (key === 'WEATHER_API_KEY') return 'test-key';
      if (key === 'BASE_WEATHER_URL') return 'http://test-url/';
      return '';
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WeatherApiClientService,
        { provide: ConfigService, useValue: mockConfigService },
        { provide: FetchService, useValue: { get: jest.fn() } },
      ],
    }).compile();

    service = module.get<WeatherApiClientService>(WeatherApiClientService);
    fetchService = module.get<FetchService>(FetchService);
  });

  it('should call fetch.get with correct URL', async () => {
    (fetchService.get as jest.Mock).mockResolvedValueOnce({ some: 'data' });
    await service.getCityWeather('London');
    const getSpy = jest.spyOn(fetchService, 'get');
    expect(getSpy).toHaveBeenCalledWith(
      'http://test-url//current.json?key=test-key&q=London&aqi=yes',
    );
  });
});
