import { status } from '@grpc/grpc-js';
import { INestApplication } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'apps/subscription/src/app.module';
import { AppConfig } from 'apps/subscription/src/config/app.config';
import { PrismaService } from 'apps/subscription/src/infrastructure/database/prisma.service';
import {
  Frequency as ProtoFrequency,
  SubscribeRequest,
} from 'libs/proto/generated/subscription';
import { SubscriptionServiceDefinition } from 'libs/proto/generated/subscription';
import { SubscriptionClient } from 'libs/types/clients.grpc.types';
import { createChannel, createClient } from 'nice-grpc';

const makeDto = (overrides?: Partial<SubscribeRequest>): SubscribeRequest => ({
  email: `integration+${Date.now()}@example.com`,
  city: 'Kyiv',
  frequency: ProtoFrequency.daily,
  ...overrides,
});

describe('SubscriptionService gRPC (integration)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let service: SubscriptionClient;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    const config = app.get(AppConfig);

    app.connectMicroservice({
      transport: Transport.GRPC,
      options: {
        package: 'subscription',
        protoPath: 'libs/proto/subscription.proto',
        url: `localhost:${config.port}`,
      },
    });

    await app.startAllMicroservices();
    await app.init();

    const channel = createChannel(`localhost:${config.port}`);
    service = createClient(SubscriptionServiceDefinition, channel);

    prisma = app.get(PrismaService);
  });
  afterEach(async () => {
    await prisma.token.deleteMany({
      where: { subscription: { email: { contains: 'integration+' } } },
    });
    await prisma.subscription.deleteMany({
      where: { email: { contains: 'integration+' } },
    });
  });

  afterAll(async () => {
    await app.close();
  });

  it('should subscribe successfully', async () => {
    const dto = makeDto();

    const res = await service.subscribe(dto);

    expect(res).toHaveProperty('email', dto.email);
    expect(res).toHaveProperty('token');

    const saved = await prisma.subscription.findFirst({
      where: { email: dto.email },
    });
    expect(saved).toBeTruthy();
    expect(saved!.city).toBe(dto.city);
    expect(saved!.frequency).toBe('daily');
  });

  it('should confirms with valid token', async () => {
    const dto = makeDto();

    await service.subscribe(dto);
    const token = await prisma.token.findFirst({
      where: { subscription: { email: dto.email } },
    });

    const res = await service.confirm({ token: token!.token });
    expect(res).toHaveProperty('message');

    const sub = await prisma.subscription.findFirst({
      where: { email: dto.email },
    });
    expect(sub?.confirmed).toBe(true);
  });

  it('should throws NOT_FOUND with invalid token', async () => {
    await expect(
      service.confirm({ token: 'invalid-token' }),
    ).rejects.toMatchObject({
      code: status.NOT_FOUND,
      message: expect.stringContaining('Token not found') as string,
    });
  });

  it('should unsubscribes successfully', async () => {
    const dto = makeDto();

    await service.subscribe(dto);
    const token = await prisma.token.findFirst({
      where: { subscription: { email: dto.email } },
    });

    await service.confirm({ token: token!.token });
    const res = await service.unsubscribe({ token: token!.token });

    expect(res).toHaveProperty('message');

    const sub = await prisma.subscription.findFirst({
      where: { email: dto.email },
    });
    expect(sub).toBeNull();
  });

  it('should throws NOT_FOUND for invalid token', async () => {
    await expect(
      service.unsubscribe({ token: 'invalid-token' }),
    ).rejects.toMatchObject({
      code: status.NOT_FOUND,
      message: expect.stringContaining('Token not found') as string,
    });
  });

  it('should returns subscriptions by frequency', async () => {
    const dto = makeDto();

    const res1 = await service.subscribe(dto);
    console.log(res1);

    const token = await prisma.token.findFirst({
      where: { subscription: { email: dto.email } },
    });

    await service.confirm({ token: token!.token });

    const res = await service.getByFrequency({
      frequency: ProtoFrequency.daily,
    });

    expect(res.subscriptions.length).toBeGreaterThan(0);

    const [first] = res.subscriptions;
    expect(first).toHaveProperty('email');
    expect(first).toHaveProperty('city');
    expect(Array.isArray(first.tokens)).toBe(true);
  });

  it('should deletes unconfirmed subscriptions', async () => {
    const dto = makeDto();

    await service.subscribe(dto);
    const res = await service.deleteUnconfirmed({});

    expect(res).toHaveProperty('count');
    expect(res.count).toBeGreaterThanOrEqual(1);
  });
});
