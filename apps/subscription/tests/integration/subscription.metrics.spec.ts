import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'apps/subscription/src/app.module';
import { SUBSCRIPTION_OPERATION_STATUS } from 'apps/subscription/src/infrastructure/metrics/constants/metrics.constants';
import { SubscriptionMetrics } from 'apps/subscription/src/infrastructure/metrics/subscription-metrics';
import { Server } from 'http';
import * as request from 'supertest';

const methods = [
  'create',
  'findOne',
  'delete',
  'confirm',
  'findByFrequency',
  'deleteUnconfirmed',
];

describe('SubscriptionMetrics (integration)', () => {
  let app: INestApplication<Server>;
  let metricsService: SubscriptionMetrics;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    metricsService = app.get<SubscriptionMetrics>(SubscriptionMetrics);
  });

  beforeEach(() => {
    metricsService.clearAllMetrics();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should track all statuses for all methods', async () => {
    for (const method of methods) {
      metricsService.recordOperation(
        method,
        SUBSCRIPTION_OPERATION_STATUS.SUCCESS,
      );
      metricsService.recordOperation(
        method,
        SUBSCRIPTION_OPERATION_STATUS.ERROR,
      );
    }

    const response = await request(app.getHttpServer())
      .get('/metrics')
      .expect(200);

    for (const method of methods) {
      expect(response.text).toContain(
        `subscription_operation_total{method="${method}",status="success",app="subscription-api"} 1`,
      );
      expect(response.text).toContain(
        `subscription_operation_total{method="${method}",status="error",app="subscription-api"} 1`,
      );
    }
  });

  it('should track operation durations for all statuses', async () => {
    for (const method of methods) {
      const successTimer = metricsService.createOperationStopper(method);
      await new Promise((resolve) => setTimeout(resolve, 2));
      successTimer(SUBSCRIPTION_OPERATION_STATUS.SUCCESS);

      const errorTimer = metricsService.createOperationStopper(method);
      await new Promise((resolve) => setTimeout(resolve, 2));
      errorTimer(SUBSCRIPTION_OPERATION_STATUS.ERROR);
    }

    const response = await request(app.getHttpServer())
      .get('/metrics')
      .expect(200);

    for (const method of methods) {
      expect(response.text).toContain(
        `subscription_operation_duration_seconds_count{app="subscription-api",method="${method}",status="success"} 1`,
      );
      expect(response.text).toContain(
        `subscription_operation_duration_seconds_count{app="subscription-api",method="${method}",status="error"} 1`,
      );
    }
  });
});
