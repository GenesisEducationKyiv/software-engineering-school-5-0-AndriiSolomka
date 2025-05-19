import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from 'src/app.module';

describe('Subscribe (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  let token: string;

  it('/subscribe (POST) - subscribe user', async () => {
    const dto = {
      email: `test+${Date.now()}@example.com`,
      city: 'Kyiv',
      frequency: 'daily',
    };

    const res = await request(app.getHttpServer())
      .post('/subscribe')
      .send(dto)
      .expect(201);

    expect(res.body).toHaveProperty('message');
    const body = res.body as { message: string; token?: string };
    if (body.token) token = body.token;
  });

  it('/subscribe/confirm (POST) - confirm subscription', async () => {
    if (!token) return;
    await request(app.getHttpServer())
      .post('/subscribe/confirm')
      .send({ token })
      .expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
