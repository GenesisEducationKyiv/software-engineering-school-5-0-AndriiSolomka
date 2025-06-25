import { CityService } from '../city.service';
import { WeatherDomainService } from 'src/weather-domain/weather-domain.service';
import { CacheCityService } from 'src/cache-city/cache-city.service';
import { Test } from '@nestjs/testing';

describe('CityService', () => {
  let service: CityService;
  let weatherDomainMock: jest.Mocked<Pick<WeatherDomainService, 'findCity'>>;
  let cacheCityMock: jest.Mocked<Pick<CacheCityService, 'get' | 'set'>>;

  beforeEach(async () => {
    weatherDomainMock = {
      findCity: jest.fn(),
    };
    cacheCityMock = {
      get: jest.fn(),
      set: jest.fn(),
    };
    const module = await Test.createTestingModule({
      providers: [
        CityService,
        {
          provide: WeatherDomainService,
          useValue: weatherDomainMock,
        },
        {
          provide: CacheCityService,
          useValue: cacheCityMock,
        },
      ],
    }).compile();

    service = module.get<CityService>(CityService);
  });

  it('should return cached locations if present', async () => {
    const city = 'Kyiv';
    const cached = [
      {
        id: 1,
        name: 'Kyiv',
        region: 'Kyiv City',
        country: 'UA',
        lat: 50.45,
        lon: 30.523,
        url: 'kyiv-ukraine',
      },
    ];
    cacheCityMock.get.mockResolvedValueOnce(cached);

    const result = await service.checkCityLocations(city);

    expect(cacheCityMock.get).toHaveBeenCalledWith(city);
    expect(result).toBe(cached);
    expect(weatherDomainMock.findCity).not.toHaveBeenCalled();
    expect(cacheCityMock.set).not.toHaveBeenCalled();
  });

  it('should fetch locations and cache them if not cached', async () => {
    const city = 'Lviv';
    cacheCityMock.get.mockResolvedValueOnce(null);
    const found = [
      {
        id: 2,
        name: 'Lviv',
        region: 'Lviv Region',
        country: 'UA',
        lat: 49.8397,
        lon: 24.0297,
        url: 'lviv-ukraine',
      },
    ];
    weatherDomainMock.findCity.mockResolvedValueOnce(found);

    const result = await service.checkCityLocations(city);

    expect(cacheCityMock.get).toHaveBeenCalledWith(city);
    expect(weatherDomainMock.findCity).toHaveBeenCalledWith(city);
    expect(cacheCityMock.set).toHaveBeenCalledWith(city, found);
    expect(result).toBe(found);
  });
});
