import { status } from '@grpc/grpc-js';
import { INestApplication } from '@nestjs/common';
import { ClientGrpc, ClientsModule, Transport } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'apps/subscription/src/app.module';
import { PrismaService } from 'apps/subscription/src/infrastructure/database/prisma.service';
import {
  ActionResponse,
  ConfirmRequest,
  DeleteUnconfirmedRequest,
  DeleteUnconfirmedResponse,
  GetByFrequencyRequest,
  GetByFrequencyResponse,
  Frequency as ProtoFrequency,
  SubscribeRequest,
  SubscribeResponse,
  UnsubscribeRequest,
} from 'libs/proto/generated/subscription';
import { Observable, firstValueFrom } from 'rxjs';

interface SubscriptionServiceClient {
  Subscribe(request: SubscribeRequest): Observable<SubscribeResponse>;
  Confirm(request: ConfirmRequest): Observable<ActionResponse>;
  Unsubscribe(request: UnsubscribeRequest): Observable<ActionResponse>;
  GetByFrequency(
    request: GetByFrequencyRequest,
  ): Observable<GetByFrequencyResponse>;
  DeleteUnconfirmed(
    request: DeleteUnconfirmedRequest,
  ): Observable<DeleteUnconfirmedResponse>;
}

const grpcOptions = {
  package: 'subscription',
  protoPath: 'libs/proto/subscription.proto',
  url: 'localhost:50052',
};

const makeDto = (overrides?: Partial<SubscribeRequest>): SubscribeRequest => ({
  email: `integration+${Date.now()}@example.com`,
  city: 'Kyiv',
  frequency: ProtoFrequency.daily,
  ...overrides,
});

describe('SubscriptionService gRPC (integration)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let service: SubscriptionServiceClient;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        ClientsModule.register([
          {
            name: 'SUBSCRIPTION_PACKAGE',
            transport: Transport.GRPC,
            options: grpcOptions,
          },
        ]),
      ],
    }).compile();

    app = moduleRef.createNestApplication();

    app.connectMicroservice({
      transport: Transport.GRPC,
      options: grpcOptions,
    });

    await app.startAllMicroservices();
    await app.init();

    const grpcClient = app.get<ClientGrpc>('SUBSCRIPTION_PACKAGE');
    service = grpcClient.getService<SubscriptionServiceClient>(
      'SubscriptionService',
    );
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

    const res = await firstValueFrom(service.Subscribe(dto));

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

    await firstValueFrom(service.Subscribe(dto));
    const token = await prisma.token.findFirst({
      where: { subscription: { email: dto.email } },
    });

    const res = await firstValueFrom(service.Confirm({ token: token!.token }));
    expect(res).toHaveProperty('message');

    const sub = await prisma.subscription.findFirst({
      where: { email: dto.email },
    });
    expect(sub?.confirmed).toBe(true);
  });

  it('should throws NOT_FOUND with invalid token', async () => {
    await expect(
      firstValueFrom(service.Confirm({ token: 'invalid-token' })),
    ).rejects.toMatchObject({
      code: status.NOT_FOUND,
      message: expect.stringContaining('Token not found') as string,
    });
  });

  it('should unsubscribes successfully', async () => {
    const dto = makeDto();

    await firstValueFrom(service.Subscribe(dto));
    const token = await prisma.token.findFirst({
      where: { subscription: { email: dto.email } },
    });

    await firstValueFrom(service.Confirm({ token: token!.token }));
    const res = await firstValueFrom(
      service.Unsubscribe({ token: token!.token }),
    );

    expect(res).toHaveProperty('message');

    const sub = await prisma.subscription.findFirst({
      where: { email: dto.email },
    });
    expect(sub).toBeNull();
  });

  it('should throws NOT_FOUND for invalid token', async () => {
    await expect(
      firstValueFrom(service.Unsubscribe({ token: 'invalid-token' })),
    ).rejects.toMatchObject({
      code: status.NOT_FOUND,
      message: expect.stringContaining('Token not found') as string,
    });
  });

  it('should returns subscriptions by frequency', async () => {
    const dto = makeDto({ frequency: ProtoFrequency.hourly });

    await firstValueFrom(service.Subscribe(dto));

    const token = await prisma.token.findFirst({
      where: { subscription: { email: dto.email } },
    });

    await firstValueFrom(service.Confirm({ token: token!.token }));

    const res = await firstValueFrom(
      service.GetByFrequency({ frequency: ProtoFrequency.hourly }),
    );

    expect(res.subscriptions.length).toBeGreaterThan(0);

    const [first] = res.subscriptions;
    expect(first).toHaveProperty('email');
    expect(first).toHaveProperty('city');
    expect(Array.isArray(first.tokens)).toBe(true);
  });

  it('should deletes unconfirmed subscriptions', async () => {
    const dto = makeDto();

    await firstValueFrom(service.Subscribe(dto));
    const res = await firstValueFrom(service.DeleteUnconfirmed({}));

    expect(res).toHaveProperty('count');
    expect(res.count).toBeGreaterThanOrEqual(1);
  });
});
