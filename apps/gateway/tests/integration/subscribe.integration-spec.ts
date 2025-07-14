import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'apps/gateway/src/app.module';
import { Frequency } from 'apps/gateway/src/subscription/core/subscription.interface';
import { Server } from 'http';
import { searchApi } from 'libs/common/setup/msw/handlers/geocoding';
import { mockServer } from 'libs/common/setup/msw/setup';
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

  beforeEach(() => {
    mockServer.clearHandlers();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/subscribe', () => {
    it('should subscribe successfully and return confirmation message', async () => {
      mockServer.addHandlers([searchApi.ok()]);

      const dto = makeDto();
      const res = await request(app.getHttpServer())
        .post('/api/subscribe')
        .send(dto)
        .expect(201);

      expect(res.body).toHaveProperty('message');
    });

    it('should return 404 for non-existent city (CityValidationPipe)', async () => {
      mockServer.addHandlers([searchApi.notFound()]);

      const dto = makeDto({ city: 'InvalidCity' });
      await request(app.getHttpServer())
        .post('/api/subscribe')
        .send(dto)
        .expect(404);
    });

    it('should return 400 for invalid email', async () => {
      const dto = makeDto({ email: 'invalid-email' });
      await request(app.getHttpServer())
        .post('/api/subscribe')
        .send(dto)
        .expect(400);
    });

    it('should return 400 for missing fields', async () => {
      await request(app.getHttpServer())
        .post('/api/subscribe')
        .send({ city: 'Kyiv' })
        .expect(400);
    });

    it('should return 400 for invalid frequency', async () => {
      const dto = makeDto({ frequency: 'weekly' });
      await request(app.getHttpServer())
        .post('/api/subscribe')
        .send(dto)
        .expect(400);
    });
  });
});
