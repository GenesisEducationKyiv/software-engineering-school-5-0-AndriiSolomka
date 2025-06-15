import { CityService } from '../city.service';
import { ICityService } from '../interfaces/city-service.interface';
import { ILocation } from 'src/constants/types/weather/weather-client.interface';
import { WeatherDomainService } from 'src/weather-domain/weather-domain.service';
import { CacheCityService } from 'src/cache-city/cache-city.service';

describe('CityService', () => {
  let service: ICityService;
  let weatherDomainMock: jest.Mocked<Pick<WeatherDomainService, 'findCity'>>;
  let cacheCityMock: jest.Mocked<Pick<CacheCityService, 'get' | 'set'>>;

  beforeEach(() => {
    weatherDomainMock = {
      findCity: jest.fn(),
    };
    cacheCityMock = {
      get: jest.fn(),
      set: jest.fn(),
    };
    service = new CityService(
      weatherDomainMock as unknown as WeatherDomainService,
      cacheCityMock as unknown as CacheCityService,
    );
  });

  it('should return cached locations if present', async () => {
    const city = 'Kyiv';
    const cached: ILocation[] = [{ name: 'Kyiv', country: 'UA' } as ILocation];
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
    const found: ILocation[] = [{ name: 'Lviv', country: 'UA' } as ILocation];
    weatherDomainMock.findCity.mockResolvedValueOnce(found);

    const result = await service.checkCityLocations(city);

    expect(cacheCityMock.get).toHaveBeenCalledWith(city);
    expect(weatherDomainMock.findCity).toHaveBeenCalledWith(city);
    expect(cacheCityMock.set).toHaveBeenCalledWith(city, found);
    expect(result).toBe(found);
  });
});
