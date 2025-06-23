import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { Server } from 'http';
import { Frequency } from '@prisma/client';
import { setupApp } from 'src/common/setup/setup';
import { setupMswServer } from 'src/common/setup/msw/test.server';
import { EmailService } from 'src/email/email.service';

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
  let prisma: PrismaService;
  let emailService: EmailService;
  let sendConfirmationEmailSpy: jest.SpyInstance;
  let sendWeatherEmailSpy: jest.SpyInstance;

  setupMswServer();

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    setupApp(app);
    await app.init();

    prisma = app.get(PrismaService);
    emailService = app.get(EmailService);

    sendConfirmationEmailSpy = jest
      .spyOn(emailService, 'sendConfirmationEmail')
      .mockImplementation(() => Promise.resolve());

    sendWeatherEmailSpy = jest
      .spyOn(emailService, 'sendWeatherEmail')
      .mockImplementation(() => Promise.resolve());
  });

  afterEach(async () => {
    sendConfirmationEmailSpy.mockClear();
    sendWeatherEmailSpy.mockClear();
    await prisma.token.deleteMany({
      where: { subscription: { email: { contains: 'integration+' } } },
    });
    await prisma.subscription.deleteMany({
      where: { email: { contains: 'integration+' } },
    });
  });

  afterAll(async () => {
    sendConfirmationEmailSpy.mockRestore();
    sendWeatherEmailSpy.mockRestore();
    await app.close();
  });

  describe('POST /subscribe', () => {
    it('should subscribe successfully', async () => {
      const dto = makeDto();
      const res = await request(app.getHttpServer())
        .post('/api/subscribe')
        .send(dto)
        .expect(201);

      expect(res.body).toHaveProperty('message');
      const sub = await prisma.subscription.findFirst({
        where: { email: dto.email },
      });
      expect(sub).not.toBeNull();
      expect(sub?.city).toBe(dto.city);
      expect(sub?.frequency).toBe(dto.frequency);
    });

    it('should return 409 if subscription already exists', async () => {
      const dto = makeDto();
      await request(app.getHttpServer())
        .post('/api/subscribe')
        .send(dto)
        .expect(201);
      await request(app.getHttpServer())
        .post('/api/subscribe')
        .send(dto)
        .expect(409);
    });

    it('should return 404 for invalid city', async () => {
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

    it('should return 400 for missing required fields', async () => {
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

  describe('GET /confirm/:token', () => {
    it('should confirm subscription', async () => {
      const dto = makeDto();
      await request(app.getHttpServer())
        .post('/api/subscribe')
        .send(dto)
        .expect(201);
      const tokenEntity = await prisma.token.findFirst({
        where: { subscription: { email: dto.email } },
      });
      expect(tokenEntity).not.toBeNull();
      const res = await request(app.getHttpServer())
        .get(`/api/confirm/${tokenEntity!.token}`)
        .expect(200);

      expect(res.body).toHaveProperty('message');
      const sub = await prisma.subscription.findFirst({
        where: { email: dto.email },
      });
      expect(sub?.confirmed).toBe(true);
    });

    it('should return 404 for invalid token', async () => {
      await request(app.getHttpServer())
        .get('/api/confirm/invalid-token')
        .expect(404);
    });
  });

  describe('GET /unsubscribe/:token', () => {
    it('should unsubscribe successfully', async () => {
      const dto = makeDto();
      await request(app.getHttpServer())
        .post('/api/subscribe')
        .send(dto)
        .expect(201);
      const tokenEntity = await prisma.token.findFirst({
        where: { subscription: { email: dto.email } },
      });
      expect(tokenEntity).not.toBeNull();
      await request(app.getHttpServer())
        .get(`/api/confirm/${tokenEntity!.token}`)
        .expect(200);
      const res = await request(app.getHttpServer())
        .get(`/api/unsubscribe/${tokenEntity!.token}`)
        .expect(200);

      expect(res.body).toHaveProperty('message');
      const sub = await prisma.subscription.findFirst({
        where: { email: dto.email },
      });
      expect(sub).toBeNull();
    });

    it('should return 404 for invalid token', async () => {
      await request(app.getHttpServer())
        .get('/api/unsubscribe/invalid-token')
        .expect(404);
    });

    it('should return 404 when already unsubscribed', async () => {
      const dto = makeDto();
      await request(app.getHttpServer())
        .post('/api/subscribe')
        .send(dto)
        .expect(201);
      const tokenEntity = await prisma.token.findFirst({
        where: { subscription: { email: dto.email } },
      });
      expect(tokenEntity).not.toBeNull();
      await request(app.getHttpServer())
        .get(`/api/confirm/${tokenEntity!.token}`)
        .expect(200);
      await request(app.getHttpServer())
        .get(`/api/unsubscribe/${tokenEntity!.token}`)
        .expect(200);
      await request(app.getHttpServer())
        .get(`/api/unsubscribe/${tokenEntity!.token}`)
        .expect(404);
    });
  });
});
