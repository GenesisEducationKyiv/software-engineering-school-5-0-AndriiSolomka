import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { SubscribeService } from 'src/subscribe/subscribe.service';
import { CreateSubscriptionDto } from 'src/subscribe/dto/create-subscribe.dto';
import { Frequency } from '@prisma/client';
import { AppModule } from 'src/app.module';

describe('SubscribeService (integration, real DB)', () => {
  let prisma: PrismaService;
  let subscribeService: SubscribeService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    prisma = module.get(PrismaService);
    subscribeService = module.get(SubscribeService);
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await module.close();
  });

  afterEach(async () => {
    await prisma.subscription.deleteMany({
      where: { email: { contains: 'integration+' } },
    });
  });

  it('should create and confirm subscription in real DB', async () => {
    const dto: CreateSubscriptionDto = {
      email: `integration+${Date.now()}@example.com`,
      city: 'Kyiv',
      frequency: Frequency.daily,
    };

    const subscribeResult = await subscribeService.subscribe(dto);
    expect(subscribeResult).toHaveProperty('message');

    const sub = await prisma.subscription.findFirst({
      where: { email: dto.email },
    });
    expect(sub).not.toBeNull();
    expect(sub?.confirmed).toBe(false);

    const tokenEntity = await prisma.token.findFirst({
      where: { subscription_id: sub?.subscription_id },
    });
    expect(tokenEntity).not.toBeNull();

    const confirmResult = await subscribeService.confirm(tokenEntity!.token);
    expect(confirmResult).toHaveProperty('message');

    const confirmedSub = await prisma.subscription.findUnique({
      where: { subscription_id: sub!.subscription_id },
    });
    expect(confirmedSub?.confirmed).toBe(true);
  });

  it('should unsubscribe user in real DB', async () => {
    const dto: CreateSubscriptionDto = {
      email: `integration+${Date.now()}@example.com`,
      city: 'Lviv',
      frequency: Frequency.daily,
    };

    await subscribeService.subscribe(dto);
    const sub = await prisma.subscription.findFirst({
      where: { email: dto.email },
    });
    const tokenEntity = await prisma.token.findFirst({
      where: { subscription_id: sub?.subscription_id },
    });

    await subscribeService.confirm(tokenEntity!.token);

    const unsubscribeResult = await subscribeService.unsubscribe(
      tokenEntity!.token,
    );
    expect(unsubscribeResult).toHaveProperty('message');

    const deletedSub = await prisma.subscription.findUnique({
      where: { subscription_id: sub!.subscription_id },
    });
    expect(deletedSub).toBeNull();
  });
});
