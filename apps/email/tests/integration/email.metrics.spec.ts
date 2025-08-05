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

  const testMethod = 'confirmation';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    metricsService = app.get<EmailMetrics>(EmailMetrics);
  });

  afterEach(() => {
    metricsService.clearAllMetrics();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should record sent emails', async () => {
    metricsService.recordSent(testMethod, EMAIL_SEND_STATUS.SUCCESS);
    metricsService.recordSent(testMethod, EMAIL_SEND_STATUS.SUCCESS);
    metricsService.recordSent(testMethod, EMAIL_SEND_STATUS.ERROR);

    const response = await request(app.getHttpServer())
      .get('/metrics')
      .expect(200);

    expect(response.text).toContain(
      `email_sent_total{method="${testMethod}",status="success",app="email-api"} 2`,
    );
    expect(response.text).toContain(
      `email_sent_total{method="${testMethod}",status="error",app="email-api"} 1`,
    );
  });

  it('should record send errors', async () => {
    metricsService.recordSendError(testMethod, 'ECONNREFUSED');
    metricsService.recordSendError(testMethod, 'ETIMEOUT');

    const response = await request(app.getHttpServer())
      .get('/metrics')
      .expect(200);

    expect(response.text).toContain(
      `email_send_errors_total{method="${testMethod}",error_code="ECONNREFUSED",app="email-api"} 1`,
    );
    expect(response.text).toContain(
      `email_send_errors_total{method="${testMethod}",error_code="ETIMEOUT",app="email-api"} 1`,
    );
  });

  it('should record success send durations', async () => {
    await metricsService.withDuration(testMethod, async () => {
      await new Promise((resolve) => setTimeout(resolve, 10));
    });

    const response = await request(app.getHttpServer())
      .get('/metrics')
      .expect(200);

    expect(response.text).toContain(
      `email_send_duration_seconds_bucket{le="0.5",app="email-api",method="${testMethod}",status="success"}`,
    );
    expect(response.text).toContain(
      `email_send_duration_seconds_count{app="email-api",method="${testMethod}",status="success"} 1`,
    );
    expect(response.text).toContain(
      `email_send_duration_seconds_sum{app="email-api",method="${testMethod}",status="success"}`,
    );
  });

  it('should record error send durations', async () => {
    await expect(
      metricsService.withDuration(testMethod, () => {
        throw new Error('Test error');
      }),
    ).rejects.toThrow('Test error');

    const response = await request(app.getHttpServer())
      .get('/metrics')
      .expect(200);

    expect(response.text).toContain(
      `email_send_duration_seconds_bucket{le="0.5",app="email-api",method="${testMethod}",status="error"}`,
    );
    expect(response.text).toContain(
      `email_send_duration_seconds_count{app="email-api",method="${testMethod}",status="error"} 1`,
    );
    expect(response.text).toContain(
      `email_send_duration_seconds_sum{app="email-api",method="${testMethod}",status="error"}`,
    );
  });
});
