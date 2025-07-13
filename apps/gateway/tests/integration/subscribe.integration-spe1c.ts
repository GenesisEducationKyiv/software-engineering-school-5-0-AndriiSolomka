// import { INestApplication } from '@nestjs/common';
// import { Test, TestingModule } from '@nestjs/testing';
// import { AppModule } from 'apps/gateway/src/app.module';
// import { Frequency } from 'apps/gateway/src/subscription/core/subscription.interface';
// import { PrismaService } from 'apps/subscription/src/infrastructure/database/prisma.service';
// import { Server } from 'http';
// import { searchApi } from 'libs/common/setup/msw/handlers/geocoding';
// import { weatherApi } from 'libs/common/setup/msw/handlers/weather-api';
// import { mockServer } from 'libs/common/setup/msw/setup';
// import { setupApp } from 'libs/common/setup/setup';
// import * as request from 'supertest';

// const makeDto = (
//   overrides?: Partial<{ email: string; city: string; frequency: string }>,
// ) => ({
//   email: `integration+${Date.now()}@example.com`,
//   city: 'Kyiv',
//   frequency: Frequency.daily,
//   ...overrides,
// });

// describe('SubscriptionController (integration)', () => {
//   let app: INestApplication<Server>;
//   let prisma: PrismaService;

//   beforeAll(async () => {
//     const moduleFixture: TestingModule = await Test.createTestingModule({
//       imports: [AppModule],
//     }).compile();

//     app = moduleFixture.createNestApplication();
//     setupApp(app);
//     await app.init();

//     prisma = app.get(PrismaService);
//   });

//   beforeEach(() => {
//     mockServer.clearHandlers();
//   });

//   afterEach(async () => {
//     await prisma.token.deleteMany({
//       where: { subscription: { email: { contains: 'integration+' } } },
//     });
//     await prisma.subscription.deleteMany({
//       where: { email: { contains: 'integration+' } },
//     });
//   });

//   afterAll(async () => {
//     await app.close();
//   });

//   describe('POST /api/subscription', () => {
//     it('should subscribe successfully with valid city', async () => {
//       mockServer.addHandlers([searchApi.ok(), weatherApi.ok()]);

//       const dto = makeDto();
//       const res = await request(app.getHttpServer())
//         .post('/api/subscription')
//         .send(dto)
//         .expect(201);

//       expect(res.body).toHaveProperty('message');

//       const sub = await prisma.subscription.findFirst({
//         where: { email: dto.email },
//       });

//       expect(sub).not.toBeNull();
//       expect(sub?.city).toBe(dto.city);
//     });

//     it('should return 404 for invalid city', async () => {
//       mockServer.addHandlers([searchApi.notFound()]);

//       const dto = makeDto({ city: 'InvalidCity' });
//       await request(app.getHttpServer())
//         .post('/api/subscription')
//         .send(dto)
//         .expect(404);
//     });

//     it('should return 400 for invalid email', async () => {
//       const dto = makeDto({ email: 'invalid-email' });
//       await request(app.getHttpServer())
//         .post('/api/subscription')
//         .send(dto)
//         .expect(400);
//     });

//     it('should return 400 for missing required fields', async () => {
//       await request(app.getHttpServer())
//         .post('/api/subscription')
//         .send({ city: 'Kyiv' })
//         .expect(400);
//     });

//     it('should return 400 for invalid frequency', async () => {
//       const dto = makeDto({ frequency: 'weekly' });
//       await request(app.getHttpServer())
//         .post('/api/subscription')
//         .send(dto)
//         .expect(400);
//     });
//   });

//   describe('GET /subscription/confirm/:token', () => {
//     it('should confirm subscription', async () => {
//       mockServer.addHandlers([searchApi.ok(), weatherApi.ok()]);

//       const dto = makeDto();
//       await request(app.getHttpServer())
//         .post('/api/subscription')
//         .send(dto)
//         .expect(201);

//       const tokenEntity = await prisma.token.findFirst({
//         where: { subscription: { email: dto.email } },
//       });

//       expect(tokenEntity).not.toBeNull();

//       const res = await request(app.getHttpServer())
//         .get(`/api/subscription/confirm/${tokenEntity!.token}`)
//         .expect(200);

//       expect(res.body).toHaveProperty('message');

//       const sub = await prisma.subscription.findFirst({
//         where: { email: dto.email },
//       });

//       expect(sub?.confirmed).toBe(true);
//     });

//     it('should return 404 for invalid token', async () => {
//       await request(app.getHttpServer())
//         .get('/api/subscription/confirm/invalid-token')
//         .expect(404);
//     });
//   });

//   describe('POST /subscription/unsubscribe/:token', () => {
//     it('should unsubscribe successfully', async () => {
//       mockServer.addHandlers([searchApi.ok(), weatherApi.ok()]);

//       const dto = makeDto();
//       await request(app.getHttpServer())
//         .post('/api/subscription')
//         .send(dto)
//         .expect(201);

//       const tokenEntity = await prisma.token.findFirst({
//         where: { subscription: { email: dto.email } },
//       });

//       await request(app.getHttpServer())
//         .get(`/api/subscription/confirm/${tokenEntity!.token}`)
//         .expect(200);

//       const res = await request(app.getHttpServer())
//         .post(`/api/subscription/unsubscribe/${tokenEntity!.token}`)
//         .expect(201);

//       expect(res.body).toHaveProperty('message');

//       const sub = await prisma.subscription.findFirst({
//         where: { email: dto.email },
//       });

//       expect(sub).toBeNull();
//     });

//     it('should return 404 for already unsubscribed', async () => {
//       mockServer.addHandlers([searchApi.ok(), weatherApi.ok()]);

//       const dto = makeDto();
//       await request(app.getHttpServer())
//         .post('/api/subscription')
//         .send(dto)
//         .expect(201);

//       const tokenEntity = await prisma.token.findFirst({
//         where: { subscription: { email: dto.email } },
//       });

//       await request(app.getHttpServer())
//         .get(`/api/subscription/confirm/${tokenEntity!.token}`)
//         .expect(200);

//       await request(app.getHttpServer())
//         .post(`/api/subscription/unsubscribe/${tokenEntity!.token}`)
//         .expect(201);

//       await request(app.getHttpServer())
//         .post(`/api/subscription/unsubscribe/${tokenEntity!.token}`)
//         .expect(404);
//     });

//     it('should return 404 for invalid token', async () => {
//       await request(app.getHttpServer())
//         .post('/api/subscription/unsubscribe/invalid-token')
//         .expect(404);
//     });
//   });
// });
