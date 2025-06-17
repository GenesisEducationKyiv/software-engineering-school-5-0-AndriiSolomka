import { WeatherHandlersService } from '../weather-handlers.service';
import { WeatherDomainService } from 'src/weather-domain/weather-domain.service';
import { CacheWeatherService } from 'src/cache-weather/cache-weather.service';
import { CreateWeatherDto } from '../dto/create-weather.dto';
import { WeatherApiResponse } from 'src/constants/types/weather/weather-client.interface';
import { IWeatherHandlersService } from '../interfaces/weather-handlers.service.interface';

describe('WeatherHandlersService', () => {
  let service: IWeatherHandlersService;
  let clientMock: jest.Mocked<Pick<WeatherDomainService, 'getCityWeather'>>;
  let cacheMock: jest.Mocked<Pick<CacheWeatherService, 'get' | 'set'>>;

  beforeEach(() => {
    clientMock = {
      getCityWeather: jest.fn<Promise<WeatherApiResponse>, [string]>(),
    };
    cacheMock = {
      get: jest.fn(),
      set: jest.fn(),
    };
    service = new WeatherHandlersService(
      clientMock as unknown as WeatherDomainService,
      cacheMock as unknown as CacheWeatherService,
    );
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

    const apiResponse: WeatherApiResponse = {
      location: {
        name: 'Lviv',
        region: 'Lvivska',
        country: 'UA',
        lat: 49.84,
        lon: 24.03,
        tz_id: 'Europe/Kiev',
        localtime_epoch: 0,
        localtime: '',
      },
      current: {
        last_updated_epoch: 0,
        last_updated: '',
        temp_c: 15,
        temp_f: 59,
        is_day: 1,
        condition: { text: 'Cloudy', icon: '', code: 0 },
        wind_mph: 0,
        wind_kph: 0,
        wind_degree: 0,
        wind_dir: '',
        pressure_mb: 0,
        pressure_in: 0,
        precip_mm: 0,
        precip_in: 0,
        humidity: 60,
        cloud: 0,
        feelslike_c: 0,
        feelslike_f: 0,
        windchill_c: 0,
        windchill_f: 0,
        heatindex_c: 0,
        heatindex_f: 0,
        dewpoint_c: 0,
        dewpoint_f: 0,
        vis_km: 0,
        vis_miles: 0,
        uv: 0,
        gust_mph: 0,
        gust_kph: 0,
        air_quality: {
          co: 0,
          no2: 0,
          o3: 0,
          so2: 0,
          pm2_5: 0,
          pm10: 0,
          'us-epa-index': 0,
          'gb-defra-index': 0,
        },
      },
    };
    clientMock.getCityWeather.mockResolvedValueOnce(apiResponse);

    const expected: CreateWeatherDto = {
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
