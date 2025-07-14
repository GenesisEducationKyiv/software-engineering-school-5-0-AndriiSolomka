import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'apps/gateway/src/app.module';
import { Frequency } from 'apps/gateway/src/subscription/core/subscription.interface';
import { Server } from 'http';
import { setupApp } from 'libs/common/setup/setup';
import * as request from 'supertest';

const makeDto = (
  overrides?: Partial<{ email: string; city: string; frequency: string }>,
) => ({
  email: `integration+${Date.now()}@example.com`,
  city: 'Kyiv',
  frequency: Frequency.daily,
  ...overrides,
});

describe('SubscriptionHandlersController (integration)', () => {
  let app: INestApplication<Server>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    setupApp(app);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /subscribe', () => {
    it('should subscribe successfully with valid city', async () => {
      const dto = makeDto();
      const res = await request(app.getHttpServer())
        .post('/subscribe')
        .send(dto)
        .expect(201);

      expect(res.body).toHaveProperty('message');
      expect(typeof res.body.message).toBe('string');
    });

    it('should return 404 for invalid city', async () => {
      const dto = makeDto({ city: 'InvalidCity' });
      await request(app.getHttpServer())
        .post('/subscribe')
        .send(dto)
        .expect(404);
    });

    it('should return 400 for invalid email', async () => {
      const dto = makeDto({ email: 'invalid-email' });
      await request(app.getHttpServer())
        .post('/subscribe')
        .send(dto)
        .expect(400);
    });

    it('should return 400 for missing required fields', async () => {
      await request(app.getHttpServer())
        .post('/subscribe')
        .send({ city: 'Kyiv' })
        .expect(400);
    });

    it('should return 400 for invalid frequency', async () => {
      const dto = makeDto({ frequency: 'weekly' });
      await request(app.getHttpServer())
        .post('/subscribe')
        .send(dto)
        .expect(400);
    });
  });

  describe('GET /confirm/:token', () => {
    it('should confirm subscription', async () => {
      const dto = makeDto();
      const res = await request(app.getHttpServer())
        .post('/subscribe')
        .send(dto)
        .expect(201);

      const { token } = res.body;
      expect(token).toBeDefined();

      const confirmRes = await request(app.getHttpServer())
        .get(`/confirm/${token}`)
        .expect(200);

      expect(confirmRes.body).toHaveProperty('message');
      expect(typeof confirmRes.body.message).toBe('string');
    });

    it('should return 404 for invalid token', async () => {
      await request(app.getHttpServer())
        .get('/confirm/invalid-token')
        .expect(404);
    });
  });

  describe('GET /unsubscribe/:token', () => {
    it('should unsubscribe successfully', async () => {
      const dto = makeDto();
      const res = await request(app.getHttpServer())
        .post('/subscribe')
        .send(dto)
        .expect(201);

      const { token } = res.body;
      expect(token).toBeDefined();

      await request(app.getHttpServer()).get(`/confirm/${token}`).expect(200);

      const unsubRes = await request(app.getHttpServer())
        .get(`/unsubscribe/${token}`)
        .expect(200);

      expect(unsubRes.body).toHaveProperty('message');
      expect(typeof unsubRes.body.message).toBe('string');
    });

    it('should return 404 for invalid token', async () => {
      await request(app.getHttpServer())
        .get('/unsubscribe/invalid-token')
        .expect(404);
    });
  });
});
