import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { Server } from 'http';
import {
  CacheRepository,
  CacheRepositoryToken,
} from 'src/cache/interfaces/cache-repository.interface';
import { setupApp } from 'src/common/setup/setup';
import { setupMswServer } from 'src/common/setup/msw/test.server';
import { GeocodingService } from 'src/geocoding/geocoding.service';

describe('WeatherHandlersController (integration)', () => {
  let app: INestApplication<Server>;
  let cacheRepository: CacheRepository;
  let cityService: GeocodingService;

  setupMswServer();

  const WEATHER_CACHE_PREFIX = 'weather';
  const WEATHER_CACHE_TTL = 3600;
  const CITY_CACHE_PREFIX = 'city';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    setupApp(app);
    await app.init();

    cacheRepository = app.get(CacheRepositoryToken);
    cityService = app.get(GeocodingService);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /weather', () => {
    it('should return weather for a valid city', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/weather')
        .query({ city: 'Kyiv' })
        .expect(200);

      expect(res.body).toHaveProperty('temperature');
      expect(res.body).toHaveProperty('humidity');
      expect(res.body).toHaveProperty('description');
    });

    it('should return 404 for an invalid city', async () => {
      await request(app.getHttpServer())
        .get('/api/weather')
        .query({ city: 'InvalidCityNameForTest' })
        .expect(404);
    });

    it('should return 400 for missing city param', async () => {
      await request(app.getHttpServer()).get('/api/weather').expect(400);
    });

    it('should cache weather data and return cached value on second request', async () => {
      const city = 'Kyiv';
      const key = city.toLowerCase();

      const fakeWeather = {
        temperature: 123,
        humidity: 99,
        description: 'FAKE',
      };

      await request(app.getHttpServer())
        .get('/api/weather')
        .query({ city })
        .expect(200);

      await cacheRepository.setWithExpiry(
        WEATHER_CACHE_PREFIX,
        key,
        JSON.stringify(fakeWeather),
        WEATHER_CACHE_TTL,
      );

      const res2 = await request(app.getHttpServer())
        .get('/api/weather')
        .query({ city })
        .expect(200);

      expect(res2.body).toEqual(fakeWeather);

      const cachedData = await cacheRepository.get(WEATHER_CACHE_PREFIX, key);
      expect(cachedData).toBeTruthy();
      expect(JSON.parse(cachedData!)).toEqual(fakeWeather);
    });

    it('should cache invalid city data', async () => {
      const invalidCity = 'NonExistentCityForTest';
      const key = invalidCity.toLowerCase();

      await cacheRepository.set(CITY_CACHE_PREFIX, key, '');

      await request(app.getHttpServer())
        .get('/api/weather')
        .query({ city: invalidCity })
        .expect(404);

      const cachedCityData = await cacheRepository.get(CITY_CACHE_PREFIX, key);
      expect(cachedCityData).not.toBeNull();

      const checkCitySpy = jest.spyOn(cityService, 'findCity');

      await request(app.getHttpServer())
        .get('/api/weather')
        .query({ city: invalidCity })
        .expect(404);

      expect(checkCitySpy).toHaveBeenCalledWith(invalidCity);

      checkCitySpy.mockRestore();
    });
  });
});
