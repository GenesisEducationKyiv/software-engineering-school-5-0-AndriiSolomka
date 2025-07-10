import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Server } from 'http';
import { AppModule } from 'src/app.module';
import { searchApi } from 'src/common/setup/msw/handlers/geocoding';
import { weatherApi } from 'src/common/setup/msw/handlers/weather-api';
import { mockServer } from 'src/common/setup/msw/setup';
import { setupApp } from 'src/common/setup/setup';
import {
  CacheRepositoryInterface,
  CacheRepositoryToken,
} from 'src/core/abstracts/cache/cache-repository.interface';
import { GeocodingService } from 'src/libs/geocoding/geocoding.service';
import * as request from 'supertest';

async function clearCache(
  cacheRepository: CacheRepositoryInterface,
  city: string,
) {
  await cacheRepository.set('city', city.toLowerCase(), '');
  await cacheRepository.set('weather', city.toLowerCase(), '');
}

describe('WeatherHandlersController (integration)', () => {
  let app: INestApplication<Server>;
  let cacheRepository: CacheRepositoryInterface;
  let cityService: GeocodingService;

  const WEATHER_CACHE_PREFIX = 'weather';
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

  beforeEach(() => {
    mockServer.clearHandlers();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /weather', () => {
    const validCity = 'Kyiv';
    const invalidCity = 'NonExistentCityForTest';

    beforeEach(async () => {
      await clearCache(cacheRepository, validCity);
      await clearCache(cacheRepository, invalidCity);
    });

    it('should return weather for a valid city', async () => {
      mockServer.addHandlers([searchApi.ok(), weatherApi.ok()]);

      const res = await request(app.getHttpServer())
        .get('/api/weather')
        .query({ city: validCity })
        .expect(200);

      expect(res.body).toHaveProperty('temperature');
      expect(res.body).toHaveProperty('humidity');
      expect(res.body).toHaveProperty('description');
    });

    it('should return 404 for an invalid city', async () => {
      mockServer.addHandlers([searchApi.notFound()]);

      await request(app.getHttpServer())
        .get('/api/weather')
        .query({ city: invalidCity })
        .expect(404);
    });

    it('should return 400 for missing city param', async () => {
      await request(app.getHttpServer()).get('/api/weather').expect(400);
    });

    it('should cache weather data and return cached value on second request', async () => {
      mockServer.addHandlers([searchApi.ok(), weatherApi.ok()]);

      const key = validCity.toLowerCase();

      const res1 = await request(app.getHttpServer())
        .get('/api/weather')
        .query({ city: validCity })
        .expect(200);

      const res2 = await request(app.getHttpServer())
        .get('/api/weather')
        .query({ city: validCity })
        .expect(200);

      expect(res2.body).toEqual(res1.body);

      const cachedData = await cacheRepository.get(WEATHER_CACHE_PREFIX, key);
      expect(cachedData).toBeTruthy();
      expect(JSON.parse(cachedData!)).toEqual(res1.body);
    });

    it('should cache invalid city data', async () => {
      mockServer.addHandlers([searchApi.notFound()]);

      const key = invalidCity.toLowerCase();

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
