import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'apps/weather/src/app.module';
import { CacheMetrics } from 'apps/weather/src/infrastructure/metrics/cache-metrics';
import { Server } from 'http';
import * as request from 'supertest';

describe('MetricsService (integration)', () => {
  let app: INestApplication<Server>;
  let metricsService: CacheMetrics;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    metricsService = app.get<CacheMetrics>(CacheMetrics);
  });

  afterEach(() => {
    metricsService.clearAllMetrics();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should record cache hits', async () => {
    metricsService.recordCacheHit('weather', 'get');
    metricsService.recordCacheHit('weather', 'get');
    metricsService.recordCacheHit('city', 'get');

    const response = await request(app.getHttpServer())
      .get('/metrics')
      .expect(200);

    expect(response.text).toContain(
      'cache_hit_total{cache_type="weather",method="get",app="weather-api"} 2',
    );
    expect(response.text).toContain(
      'cache_hit_total{cache_type="city",method="get",app="weather-api"} 1',
    );
  });

  it('should record cache misses', async () => {
    metricsService.recordCacheMiss('weather', 'get');
    metricsService.recordCacheMiss('city', 'getOrCompute');

    const response = await request(app.getHttpServer())
      .get('/metrics')
      .expect(200);

    expect(response.text).toContain(
      'cache_miss_total{cache_type="weather",method="get",app="weather-api"}',
    );
    expect(response.text).toContain(
      'cache_miss_total{cache_type="city",method="getOrCompute",app="weather-api"}',
    );
  });

  it('should set cache size', async () => {
    metricsService.setCacheSize('weather', 10);
    metricsService.setCacheSize('city', 5);

    const response = await request(app.getHttpServer())
      .get('/metrics')
      .expect(200);

    expect(response.text).toContain(
      'cache_size{cache_type="weather",app="weather-api"} 10',
    );
    expect(response.text).toContain(
      'cache_size{cache_type="city",app="weather-api"} 5',
    );
  });

  it('should record cache operation durations', async () => {
    await metricsService.withDuration('weather', 'set', async () => {
      await new Promise((resolve) => setTimeout(resolve, 10));
    });

    const response = await request(app.getHttpServer())
      .get('/metrics')
      .expect(200);

    expect(response.text).toContain(
      'cache_operation_duration_seconds_bucket{le="0.5",app="weather-api",cache_type="weather",method="set",status="success"}',
    );
    expect(response.text).toContain(
      'cache_operation_duration_seconds_count{app="weather-api",cache_type="weather",method="set",status="success"}',
    );
    expect(response.text).toContain(
      'cache_operation_duration_seconds_sum{app="weather-api",cache_type="weather",method="set",status="success"}',
    );
  });

  it('should record different operation statuses', async () => {
    await metricsService.withDuration('city', 'get', async () => {
      await new Promise((resolve) => setTimeout(resolve, 5));
    });

    await expect(
      metricsService.withDuration('city', 'get', async () => {
        await new Promise((resolve) => setTimeout(resolve, 5));
        throw new Error('fail');
      }),
    ).rejects.toThrow('fail');

    const response = await request(app.getHttpServer())
      .get('/metrics')
      .expect(200);

    expect(response.text).toContain(
      'cache_operation_duration_seconds_count{app="weather-api",cache_type="city",method="get",status="success"}',
    );
    expect(response.text).toContain(
      'cache_operation_duration_seconds_count{app="weather-api",cache_type="city",method="get",status="error"}',
    );
  });
});
