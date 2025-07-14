import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'apps/weather_api/src/app.module';
import { setupApp } from 'libs/common/setup/setup';
import {
  CacheRepositoryInterface,
  CacheRepositoryToken,
} from 'libs/core/cache/cache-repository.interface';

describe('RedisRepository (integration)', () => {
  let app: INestApplication;
  let cacheRepository: CacheRepositoryInterface;

  const PREFIX = 'testPrefix';
  const KEY = 'testKey';
  const VALUE = 'testValue';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    setupApp(app);
    await app.init();

    cacheRepository = app.get<CacheRepositoryInterface>(CacheRepositoryToken);
  });

  afterEach(async () => {
    await cacheRepository.set(PREFIX, KEY, '');
  });

  afterAll(async () => {
    await app.close();
  });

  it('should set and get a value from Redis', async () => {
    await cacheRepository.set(PREFIX, KEY, VALUE);
    const result = await cacheRepository.get(PREFIX, KEY);
    expect(result).toBe(VALUE);
  });

  it('should return null if key is not set', async () => {
    const result = await cacheRepository.get(PREFIX, 'nonExistingKey');
    expect(result).toBeNull();
  });

  it('should set a value with expiry and get it before expiry', async () => {
    await cacheRepository.setWithExpiry(PREFIX, KEY, VALUE, 2);
    const result = await cacheRepository.get(PREFIX, KEY);
    expect(result).toBe(VALUE);
  });

  it('should expire the value after given time', async () => {
    await cacheRepository.setWithExpiry(PREFIX, KEY, VALUE, 1);

    await new Promise((res) => setTimeout(res, 1100));

    const result = await cacheRepository.get(PREFIX, KEY);
    expect(result).toBeNull();
  });
});
