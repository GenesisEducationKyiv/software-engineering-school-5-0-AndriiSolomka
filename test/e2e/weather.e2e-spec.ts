import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from 'src/app.module';

describe('Weather (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/weather?city=Kyiv (GET) - success', async () => {
    const res = await request(app.getHttpServer())
      .get('/weather?city=Kyiv')
      .expect(200);

    expect(res.body).toHaveProperty('temperature');
    expect(res.body).toHaveProperty('humidity');
    expect(res.body).toHaveProperty('description');
  });

  it('/weather?city=UnknownCity (GET) - not found', async () => {
    await request(app.getHttpServer())
      .get('/weather?city=UnknownCity')
      .expect(404);
  });

  afterAll(async () => {
    await app.close();
  });
});
