import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Server } from 'http';
import { AppModule } from 'src/app.module';
import { searchApi } from 'common/setup/msw/handlers/geocoding';
import { mockServer } from 'common/setup/msw/setup';
import { setupApp } from 'common/setup/setup';
import {
  CacheRepositoryInterface,
  CacheRepositoryToken,
} from 'src/libs/core/cache/cache-repository.interface';
import { GeocodingInterface } from 'src/libs/core/geocoding/geocoding.interface';
import { GeocodingService } from 'src/libs/infrastructure/geocoding/geocoding.service';

describe('GeocodingService (integration)', () => {
  let app: INestApplication<Server>;
  let cacheRepository: CacheRepositoryInterface;
  let geocodingService: GeocodingInterface;

  const CITY_CACHE_PREFIX = 'city';
  const validCity = 'Berlin';
  const invalidCity = 'NonExistentCity';

  const clearCityCache = async (city: string) => {
    await cacheRepository.set(CITY_CACHE_PREFIX, city.toLowerCase(), '');
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    setupApp(app);
    await app.init();

    cacheRepository = app.get(CacheRepositoryToken);
    geocodingService = app.get(GeocodingService);
  });

  beforeEach(async () => {
    mockServer.clearHandlers();
    await clearCityCache(validCity);
    await clearCityCache(invalidCity);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return a valid city', async () => {
    mockServer.addHandlers([searchApi.ok()]);

    const result = await geocodingService.findCity(validCity);

    expect(result.name).toBe(validCity);
    expect(result.coordinates.latitude).toBe(50.45);
    expect(result.coordinates.longitude).toBe(30.52);
  });

  it('should return cached value without hitting the API again', async () => {
    mockServer.addHandlers([searchApi.ok()]);

    const firstCall = await geocodingService.findCity(validCity);

    mockServer.clearHandlers();

    const secondCall = await geocodingService.findCity(validCity);

    expect(secondCall).toEqual(firstCall);
  });

  it('should handle failed city lookup (404)', async () => {
    mockServer.addHandlers([searchApi.notFound()]);

    await expect(geocodingService.findCity(invalidCity)).rejects.toThrow(
      `City "${invalidCity}" not found`,
    );
  });
});
