import { Test, TestingModule } from '@nestjs/testing';
import { WeatherDomainService } from './weather-domain.service';
import { ConfigService } from '@nestjs/config';
import { FetchService } from '../fetch/fetch.service';

describe('WeatherApiClientService', () => {
  let service: WeatherDomainService;
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
        WeatherDomainService,
        { provide: ConfigService, useValue: mockConfigService },
        { provide: FetchService, useValue: { get: jest.fn() } },
      ],
    }).compile();

    service = module.get<WeatherDomainService>(WeatherDomainService);
    fetchService = module.get<FetchService>(FetchService);
  });

  it('should call fetch.get with correct URL for getCityWeather', async () => {
    (fetchService.get as jest.Mock).mockResolvedValueOnce({ some: 'data' });
    await service.getCityWeather('London');
    const getSpy = jest.spyOn(fetchService, 'get');
    expect(getSpy).toHaveBeenCalledWith(
      'http://test-url//current.json?key=test-key&q=London&aqi=yes',
    );
  });

  it('should call fetch.get with correct URL for findCity', async () => {
    const mockCity = 'Paris';
    (fetchService.get as jest.Mock).mockResolvedValueOnce([{ name: 'Paris' }]);
    await service.findCity(mockCity);
    const getSpy = jest.spyOn(fetchService, 'get');
    expect(getSpy).toHaveBeenCalledWith(
      'http://test-url//search.json?key=test-key&q=Paris&aqi=yes',
    );
  });
});
