import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'apps/email/src/app.module';
import { EMAIL_SEND_STATUS } from 'apps/email/src/infrastructure/metrics/constants/metrics.constants';
import { EmailMetrics } from 'apps/email/src/infrastructure/metrics/email-metrics';
import { Server } from 'http';
import * as request from 'supertest';

describe('EmailMetrics (integration)', () => {
  let app: INestApplication<Server>;
  let metricsService: EmailMetrics;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    metricsService = app.get<EmailMetrics>(EmailMetrics);
  });

  beforeEach(() => {
    metricsService.clearAllMetrics();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should record sent emails', async () => {
    metricsService.recordSent('confirmation', EMAIL_SEND_STATUS.SUCCESS);
    metricsService.recordSent('confirmation', EMAIL_SEND_STATUS.SUCCESS);
    metricsService.recordSent('weather', EMAIL_SEND_STATUS.ERROR);

    const response = await request(app.getHttpServer())
      .get('/metrics')
      .expect(200);

    expect(response.text).toContain(
      'email_sent_total{type="confirmation",status="success",app="email-api"} 2',
    );
    expect(response.text).toContain(
      'email_sent_total{type="weather",status="error",app="email-api"} 1',
    );
  });

  it('should record send errors', async () => {
    metricsService.recordSendError('confirmation', 'ECONNREFUSED');
    metricsService.recordSendError('weather', 'ETIMEOUT');

    const response = await request(app.getHttpServer())
      .get('/metrics')
      .expect(200);

    expect(response.text).toContain(
      'email_send_errors_total{type="confirmation",error_code="ECONNREFUSED",app="email-api"} 1',
    );
    expect(response.text).toContain(
      'email_send_errors_total{type="weather",error_code="ETIMEOUT",app="email-api"} 1',
    );
  });

  it('should record send durations', async () => {
    const endTimer = metricsService.createSendDurationStopper(
      'confirmation',
      EMAIL_SEND_STATUS.SUCCESS,
    );
    await new Promise((resolve) => setTimeout(resolve, 10));
    endTimer(EMAIL_SEND_STATUS.SUCCESS);

    const response = await request(app.getHttpServer())
      .get('/metrics')
      .expect(200);

    expect(response.text).toContain(
      'email_send_duration_seconds_bucket{le="0.5",app="email-api",type="confirmation",status="success"}',
    );
    expect(response.text).toContain(
      'email_send_duration_seconds_count{app="email-api",type="confirmation",status="success"}',
    );
    expect(response.text).toContain(
      'email_send_duration_seconds_sum{app="email-api",type="confirmation",status="success"}',
    );
  });

  it('should record different statuses for durations', async () => {
    const successTimer = metricsService.createSendDurationStopper(
      'weather',
      EMAIL_SEND_STATUS.SUCCESS,
    );
    await new Promise((resolve) => setTimeout(resolve, 5));
    successTimer(EMAIL_SEND_STATUS.SUCCESS);

    const errorTimer = metricsService.createSendDurationStopper(
      'weather',
      EMAIL_SEND_STATUS.ERROR,
    );
    await new Promise((resolve) => setTimeout(resolve, 5));
    errorTimer(EMAIL_SEND_STATUS.ERROR);

    const response = await request(app.getHttpServer())
      .get('/metrics')
      .expect(200);

    expect(response.text).toContain(
      'email_send_duration_seconds_count{app="email-api",type="weather",status="success"}',
    );
    expect(response.text).toContain(
      'email_send_duration_seconds_count{app="email-api",type="weather",status="error"}',
    );
  });
});
