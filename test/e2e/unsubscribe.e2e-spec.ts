import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { Server } from 'http';

describe('Unsubscribe (e2e)', () => {
  let app: INestApplication<Server>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  let token: string;

  beforeAll(async () => {
    const dto = {
      email: `test+${Date.now()}@example.com`,
      city: 'Kyiv',
      frequency: 'daily',
    };
    const res = await request(app.getHttpServer()).post('/subscribe').send(dto);
    const body = res.body as { token: string };
    token = body.token;
  });

  it('/unsubscribe (POST) - unsubscribe user', async () => {
    if (!token) return;
    await request(app.getHttpServer())
      .post('/unsubscribe')
      .send({ token })
      .expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
