import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Server } from 'http';
import { AppModule } from 'src/app.module';
import { setupApp } from 'src/common/setup/setup';
import { CACHE_OPERATION_STATUS } from 'src/infrastructure/libs/metrics/constants/metrics.constants';
import { MetricsService } from 'src/infrastructure/libs/metrics/metrics.service';
import * as request from 'supertest';

describe('MetricsService (integration)', () => {
  let app: INestApplication<Server>;
  let metricsService: MetricsService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    setupApp(app);
    await app.init();

    metricsService = app.get<MetricsService>(MetricsService);
  });

  beforeEach(() => {
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
      .get('/api/metrics')
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
    metricsService.recordCacheMiss('city', 'getOrSet');

    const response = await request(app.getHttpServer())
      .get('/api/metrics')
      .expect(200);

    expect(response.text).toContain(
      'cache_miss_total{cache_type="weather",method="get",app="weather-api"}',
    );
    expect(response.text).toContain(
      'cache_miss_total{cache_type="city",method="getOrSet",app="weather-api"}',
    );
  });

  it('should set cache size', async () => {
    metricsService.setCacheSize('weather', 10);
    metricsService.setCacheSize('city', 5);

    const response = await request(app.getHttpServer())
      .get('/api/metrics')
      .expect(200);

    expect(response.text).toContain(
      'cache_size{cache_type="weather",app="weather-api"} 10',
    );
    expect(response.text).toContain(
      'cache_size{cache_type="city",app="weather-api"} 5',
    );
  });

  it('should record cache operation durations', async () => {
    const endTimer = metricsService.createCacheOperationStopper(
      'weather',
      'set',
    );

    await new Promise((resolve) => setTimeout(resolve, 10));

    endTimer(CACHE_OPERATION_STATUS.SUCCESS);

    const response = await request(app.getHttpServer())
      .get('/api/metrics')
      .expect(200);

    expect(response.text).toContain(
      'cache_operation_duration_seconds_bucket{le="0.5",app="weather-api",cache_type="weather",operation="set",status="success"}',
    );
    expect(response.text).toContain(
      'cache_operation_duration_seconds_count{app="weather-api",cache_type="weather",operation="set",status="success"}',
    );
    expect(response.text).toContain(
      'cache_operation_duration_seconds_sum{app="weather-api",cache_type="weather",operation="set",status="success"}',
    );
  });

  it('should record different operation statuses', async () => {
    const successTimer = metricsService.createCacheOperationStopper(
      'city',
      'get',
    );
    await new Promise((resolve) => setTimeout(resolve, 5));
    successTimer(CACHE_OPERATION_STATUS.SUCCESS);

    const errorTimer = metricsService.createCacheOperationStopper(
      'city',
      'get',
    );
    await new Promise((resolve) => setTimeout(resolve, 5));
    errorTimer(CACHE_OPERATION_STATUS.ERROR);

    const response = await request(app.getHttpServer())
      .get('/api/metrics')
      .expect(200);

    expect(response.text).toContain(
      'cache_operation_duration_seconds_count{app="weather-api",cache_type="city",operation="get",status="success"}',
    );
    expect(response.text).toContain(
      'cache_operation_duration_seconds_count{app="weather-api",cache_type="city",operation="get",status="error"}',
    );
  });
});
