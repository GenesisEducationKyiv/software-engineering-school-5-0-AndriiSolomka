import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Server } from 'http';
import { AppModule } from 'src/app.module';
import { searchApi } from 'src/common/setup/msw/handlers/geocoding';
import { openMeteoApi } from 'src/common/setup/msw/handlers/openmeteo';
import { weatherApi } from 'src/common/setup/msw/handlers/weather-api';
import { mockServer } from 'src/common/setup/msw/setup';
import { setupApp } from 'src/common/setup/setup';
import {
  CacheRepositoryInterface,
  CacheRepositoryToken,
} from 'src/libs/core/cache/cache-repository.interface';
import * as request from 'supertest';

function resetMockServerWeatherApi() {
  mockServer.clearHandlers();
  mockServer.addHandlers([searchApi.ok()]);
}

async function clearCityCache(
  cacheRepository: CacheRepositoryInterface,
  city: string,
) {
  const key = city.toLowerCase();
  await cacheRepository.set('city', key, '');
  await cacheRepository.set('weather', key, '');
}

describe('Weather Providers (integration)', () => {
  let app: INestApplication<Server>;
  let cacheRepository: CacheRepositoryInterface;

  const validCity = 'Kyiv';
  const invalidCity = 'NonExistentCity';

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

  describe('GET /api/internal/weather/:city', () => {
    beforeEach(async () => {
      await clearCityCache(cacheRepository, validCity);
      await clearCityCache(cacheRepository, invalidCity);
    });

    it('should return weather from WeatherApiProvider if available', async () => {
      mockServer.addHandlers([searchApi.ok(), weatherApi.ok()]);

      const res = await request(app.getHttpServer())
        .get(`/api/internal/weather/${validCity}`)
        .expect(200);

      expect(res.body).toEqual({
        temperature: 20,
        humidity: 50,
        description: 'Sunny',
      });
    });

    it('should fallback to OpenMeteoProvider if WeatherApiProvider fails', async () => {
      mockServer.addHandlers([
        weatherApi.notFound(),
        searchApi.ok(),
        openMeteoApi.ok(),
      ]);

      const res = await request(app.getHttpServer())
        .get(`/api/internal/weather/${validCity}`)
        .expect(200);

      expect(res.body).toEqual({
        temperature: 18,
        humidity: 65,
        description: 'Mainly clear',
      });
    });

    it('should return 500 if all providers fail', async () => {
      mockServer.addHandlers([
        weatherApi.notFound(),
        searchApi.ok(),
        openMeteoApi.error(),
      ]);

      await request(app.getHttpServer())
        .get(`/api/internal/weather/${invalidCity}`)
        .expect(500);
    });

    it('should cache weather data from WeatherApiProvider and return cached value on second request', async () => {
      mockServer.addHandlers([searchApi.ok(), weatherApi.ok()]);

      const key = validCity.toLowerCase();

      const res1 = await request(app.getHttpServer())
        .get(`/api/internal/weather/${validCity}`)
        .expect(200);

      resetMockServerWeatherApi();

      const res2 = await request(app.getHttpServer())
        .get(`/api/internal/weather/${validCity}`)
        .expect(200);

      expect(res2.body).toEqual(res1.body);

      const cachedData = await cacheRepository.get('weather', key);
      expect(cachedData).toBeTruthy();
      expect(JSON.parse(cachedData!)).toEqual(res1.body);
    });

    it('should cache weather data from OpenMeteoProvider and return cached value on second request', async () => {
      mockServer.addHandlers([
        searchApi.ok(),
        weatherApi.notFound(),
        openMeteoApi.ok(),
      ]);

      const key = validCity.toLowerCase();

      const res1 = await request(app.getHttpServer())
        .get(`/api/internal/weather/${validCity}`)
        .expect(200);

      resetMockServerWeatherApi();

      const res2 = await request(app.getHttpServer())
        .get(`/api/internal/weather/${validCity}`)
        .expect(200);

      expect(res2.body).toEqual(res1.body);

      const cachedData = await cacheRepository.get('weather', key);
      expect(cachedData).toBeTruthy();
      expect(JSON.parse(cachedData!)).toEqual(res1.body);
    });
  });
});
