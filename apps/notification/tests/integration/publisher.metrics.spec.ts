import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'apps/notification/src/app.module';
import { NOTIFICATION_EMAIL_STATUS } from 'apps/notification/src/notification/infrastructure/metrics/constants/metrics.constants';
import { NotificationMetrics } from 'apps/notification/src/notification/infrastructure/metrics/notification-metrics';
import { Server } from 'http';
import { setupApp } from 'libs/common/setup/setup';
import * as request from 'supertest';

describe('NotificationMetrics (integration)', () => {
  let app: INestApplication<Server>;
  let metricsService: NotificationMetrics;

  const testMethod = 'testMethod';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    setupApp(app);
    await app.init();

    metricsService = app.get<NotificationMetrics>(NotificationMetrics);
  });

  beforeEach(() => {
    metricsService.clearAllMetrics();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should record published emails', async () => {
    metricsService.recordPublished(
      testMethod,
      NOTIFICATION_EMAIL_STATUS.SUCCESS,
    );
    metricsService.recordPublished(
      testMethod,
      NOTIFICATION_EMAIL_STATUS.SUCCESS,
    );
    metricsService.recordPublished(testMethod, NOTIFICATION_EMAIL_STATUS.ERROR);

    const response = await request(app.getHttpServer())
      .get('/api/metrics')
      .expect(200);

    expect(response.text).toContain(
      `notification_email_published_total{method="${testMethod}",status="success",app="notification-api"} 2`,
    );
    expect(response.text).toContain(
      `notification_email_published_total{method="${testMethod}",status="error",app="notification-api"} 1`,
    );
  });

  it('should record publish errors', async () => {
    metricsService.recordPublishError(testMethod, 'ECONNREFUSED');
    metricsService.recordPublishError(testMethod, 'ETIMEOUT');

    const response = await request(app.getHttpServer())
      .get('/api/metrics')
      .expect(200);

    expect(response.text).toContain(
      `notification_email_publish_errors_total{method="${testMethod}",error_code="ECONNREFUSED",app="notification-api"} 1`,
    );
    expect(response.text).toContain(
      `notification_email_publish_errors_total{method="${testMethod}",error_code="ETIMEOUT",app="notification-api"} 1`,
    );
  });

  it('should record success publish durations', async () => {
    await metricsService.withDuration(testMethod, async () => {
      await new Promise((resolve) => setTimeout(resolve, 10));
    });

    const response = await request(app.getHttpServer())
      .get('/api/metrics')
      .expect(200);

    expect(response.text).toContain(
      `notification_email_publish_duration_seconds_bucket{le="0.5",app="notification-api",method="${testMethod}",status="success"}`,
    );
    expect(response.text).toContain(
      `notification_email_publish_duration_seconds_count{app="notification-api",method="${testMethod}",status="success"} 1`,
    );
    expect(response.text).toContain(
      `notification_email_publish_duration_seconds_sum{app="notification-api",method="${testMethod}",status="success"}`,
    );
  });

  it('should record error publish durations', async () => {
    await expect(
      metricsService.withDuration(testMethod, () => {
        throw new Error('Test error');
      }),
    ).rejects.toThrow('Test error');

    const response = await request(app.getHttpServer())
      .get('/api/metrics')
      .expect(200);

    expect(response.text).toContain(
      `notification_email_publish_duration_seconds_bucket{le="0.5",app="notification-api",method="${testMethod}",status="error"}`,
    );
    expect(response.text).toContain(
      `notification_email_publish_duration_seconds_count{app="notification-api",method="${testMethod}",status="error"} 1`,
    );
    expect(response.text).toContain(
      `notification_email_publish_duration_seconds_sum{app="notification-api",method="${testMethod}",status="error"}`,
    );
  });
});
