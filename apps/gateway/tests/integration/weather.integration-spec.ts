import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'apps/gateway/src/app.module';
import { Server } from 'http';
import { searchApi } from 'libs/common/setup/msw/handlers/geocoding';
import { weatherApi } from 'libs/common/setup/msw/handlers/weather-api';
import { mockServer } from 'libs/common/setup/msw/setup';
import { setupApp } from 'libs/common/setup/setup';
import {
  CacheRepositoryInterface,
  CacheRepositoryToken,
} from 'libs/core/cache/cache-repository.interface';
import * as request from 'supertest';

function resetMockServerWeatherApi() {
  mockServer.clearHandlers();
  mockServer.addHandlers([searchApi.ok()]);
}

async function clearCache(
  cacheRepository: CacheRepositoryInterface,
  city: string,
) {
  await cacheRepository.set('city', city.toLowerCase(), '');
  await cacheRepository.set('weather', city.toLowerCase(), '');
}

describe('WeatherInternalController (integration)', () => {
  let app: INestApplication<Server>;
  let cacheRepository: CacheRepositoryInterface;

  const WEATHER_CACHE_PREFIX = 'weather';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    setupApp(app);
    await app.init();

    cacheRepository = app.get(CacheRepositoryToken);
  });

  beforeEach(() => {
    mockServer.clearHandlers();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /weather?city=', () => {
    const validCity = 'London';
    const invalidCity = 'NonExistentCityForTest';

    beforeEach(async () => {
      await clearCache(cacheRepository, validCity);
      await clearCache(cacheRepository, invalidCity);
    });

    it('should return weather for a valid city', async () => {
      mockServer.addHandlers([searchApi.ok(), weatherApi.ok()]);

      const res = await request(app.getHttpServer())
        .get(`/api/weather?city=${validCity}`)
        .expect(200);

      expect(res.body).toHaveProperty('temperature');
      expect(res.body).toHaveProperty('humidity');
      expect(res.body).toHaveProperty('description');
    });

    it('should return 404 for an invalid city', async () => {
      mockServer.addHandlers([searchApi.notFound()]);

      await request(app.getHttpServer())
        .get(`/api/weather?city=${invalidCity}`)
        .expect(404);
    });

    it('should cache weather data and return cached value on second request', async () => {
      mockServer.addHandlers([searchApi.ok(), weatherApi.ok()]);

      const key = validCity.toLowerCase();

      const res1 = await request(app.getHttpServer())
        .get(`/api/weather?city=${validCity}`)
        .expect(200);

      resetMockServerWeatherApi();

      const res2 = await request(app.getHttpServer())
        .get(`/api/weather?city=${validCity}`)
        .expect(200);

      expect(res2.body).toEqual(res1.body);

      const cachedData = await cacheRepository.get(WEATHER_CACHE_PREFIX, key);
      expect(cachedData).toBeTruthy();
      expect(JSON.parse(cachedData!)).toEqual(res1.body);
    });
  });
});
