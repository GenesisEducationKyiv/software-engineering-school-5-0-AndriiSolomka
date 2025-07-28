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
    metricsService.recordPublished(NOTIFICATION_EMAIL_STATUS.SUCCESS);
    metricsService.recordPublished(NOTIFICATION_EMAIL_STATUS.SUCCESS);
    metricsService.recordPublished(NOTIFICATION_EMAIL_STATUS.ERROR);

    const response = await request(app.getHttpServer())
      .get('/api/metrics')
      .expect(200);

    expect(response.text).toContain(
      'notification_email_published_total{status="success",app="notification-api"} 2',
    );
    expect(response.text).toContain(
      'notification_email_published_total{status="error",app="notification-api"} 1',
    );
  });

  it('should record publish errors', async () => {
    metricsService.recordPublishError('ECONNREFUSED');
    metricsService.recordPublishError('ETIMEOUT');

    const response = await request(app.getHttpServer())
      .get('/api/metrics')
      .expect(200);

    expect(response.text).toContain(
      'notification_email_publish_errors_total{error_code="ECONNREFUSED",app="notification-api"} 1',
    );
    expect(response.text).toContain(
      'notification_email_publish_errors_total{error_code="ETIMEOUT",app="notification-api"} 1',
    );
  });

  it('should record publish durations', async () => {
    const endTimer = metricsService.createPublishDurationStopper(
      NOTIFICATION_EMAIL_STATUS.SUCCESS,
    );
    await new Promise((resolve) => setTimeout(resolve, 10));
    endTimer(NOTIFICATION_EMAIL_STATUS.SUCCESS);

    const response = await request(app.getHttpServer())
      .get('/api/metrics')
      .expect(200);

    expect(response.text).toContain(
      'notification_email_publish_duration_seconds_bucket{le="0.5",app="notification-api",status="success"}',
    );
    expect(response.text).toContain(
      'notification_email_publish_duration_seconds_count{app="notification-api",status="success"}',
    );
    expect(response.text).toContain(
      'notification_email_publish_duration_seconds_sum{app="notification-api",status="success"}',
    );
  });

  it('should record different statuses for durations', async () => {
    const successTimer = metricsService.createPublishDurationStopper(
      NOTIFICATION_EMAIL_STATUS.SUCCESS,
    );
    await new Promise((resolve) => setTimeout(resolve, 5));
    successTimer(NOTIFICATION_EMAIL_STATUS.SUCCESS);

    const errorTimer = metricsService.createPublishDurationStopper(
      NOTIFICATION_EMAIL_STATUS.ERROR,
    );
    await new Promise((resolve) => setTimeout(resolve, 5));
    errorTimer(NOTIFICATION_EMAIL_STATUS.ERROR);

    const response = await request(app.getHttpServer())
      .get('/api/metrics')
      .expect(200);

    expect(response.text).toContain(
      'notification_email_publish_duration_seconds_count{app="notification-api",status="success"}',
    );
    expect(response.text).toContain(
      'notification_email_publish_duration_seconds_count{app="notification-api",status="error"}',
    );
  });
});
