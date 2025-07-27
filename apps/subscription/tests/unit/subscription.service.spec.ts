import { Test } from '@nestjs/testing';
import {
  Frequency,
  SubscriptionEntity,
} from 'apps/subscription/src/core/entities/subscription.entity';
import {
  SubscriptionRepositoryInterface,
  SubscriptionRepositoryToken,
} from 'apps/subscription/src/core/subscription/subscription-repository.interface';
import { SubscriptionInterface } from 'apps/subscription/src/core/subscription/subscription.interface';
import { SubscriptionAlreadyExistsException } from 'apps/subscription/src/infrastructure/errors/custom.errors';
import { SubscriptionFactory } from 'apps/subscription/src/infrastructure/modules/subscription.factory';
import { SubscriptionService } from 'apps/subscription/src/infrastructure/services/subscription.service';
import { randomUUID } from 'crypto';
import { LoggerToken } from 'libs/core/logger/logger.interface';

function makeSubscription(): SubscriptionEntity {
  const now = new Date();
  return {
    subscriptionId: randomUUID(),
    email: 'test@mail.com',
    city: 'Kyiv',
    frequency: Frequency.daily,
    confirmed: false,
    createdAt: now,
    updatedAt: now,
    tokens: [],
  };
}

describe('SubscriptionService (unit)', () => {
  let service: SubscriptionInterface;
  let repoMock: jest.Mocked<
    Pick<
      SubscriptionRepositoryInterface,
      | 'create'
      | 'findOne'
      | 'delete'
      | 'confirm'
      | 'findByFrequency'
      | 'deleteUnconfirmed'
    >
  >;

  beforeEach(async () => {
    repoMock = {
      create: jest.fn(),
      findOne: jest.fn(),
      delete: jest.fn(),
      confirm: jest.fn(),
      findByFrequency: jest.fn(),
      deleteUnconfirmed: jest.fn(),
    };

    const loggerMock = {
      info: jest.fn(),
      error: jest.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [
        SubscriptionFactory,
        {
          provide: SubscriptionRepositoryToken,
          useValue: repoMock,
        },
        {
          provide: LoggerToken,
          useValue: loggerMock,
        },
        {
          provide: SubscriptionService,
          useFactory: (factory: SubscriptionFactory) => factory.create(),
          inject: [SubscriptionFactory],
        },
      ],
    }).compile();

    service = module.get<SubscriptionInterface>(SubscriptionService);
  });

  describe('create', () => {
    it('should throw ConflictException if subscription exists', async () => {
      repoMock.findOne.mockResolvedValueOnce(makeSubscription());

      await expect(
        service.create({
          email: 'test@mail.com',
          city: 'Kyiv',
          frequency: Frequency.daily,
        }),
      ).rejects.toBeInstanceOf(SubscriptionAlreadyExistsException);

      expect(repoMock.findOne).toHaveBeenCalledWith('test@mail.com', 'Kyiv');
      expect(repoMock.create).not.toHaveBeenCalled();
    });

    it('should create subscription if not exists', async () => {
      repoMock.findOne.mockResolvedValueOnce(null);
      const created = makeSubscription();
      created.subscriptionId = randomUUID();

      repoMock.create.mockResolvedValueOnce(created);
      const result = await service.create({
        email: 'test@mail.com',
        city: 'Kyiv',
        frequency: Frequency.daily,
      });

      expect(repoMock.findOne).toHaveBeenCalledWith('test@mail.com', 'Kyiv');
      expect(repoMock.create).toHaveBeenCalledWith({
        email: 'test@mail.com',
        city: 'Kyiv',
        frequency: Frequency.daily,
      });
      expect(result).toBe(created);
    });
  });

  describe('confirm', () => {
    it('should confirm subscription', async () => {
      const id = randomUUID();
      const confirmed = makeSubscription();
      confirmed.subscriptionId = id;

      repoMock.confirm.mockResolvedValueOnce(confirmed);
      repoMock.confirm.mockResolvedValueOnce(confirmed);

      const result = await service.confirm(id);

      expect(repoMock.confirm).toHaveBeenCalledWith(id);
      expect(result).toBe(confirmed);
    });
  });

  describe('delete', () => {
    it('should delete subscription', async () => {
      const id = randomUUID();
      const deleted = makeSubscription();
      deleted.subscriptionId = id;

      repoMock.delete.mockResolvedValueOnce(deleted);
      const result = await service.delete(id);

      expect(repoMock.delete).toHaveBeenCalledWith(id);
      expect(result).toBe(deleted);
    });
  });

  describe('deleteUnconfirmed', () => {
    it('should delete unconfirmed subscriptions', async () => {
      repoMock.deleteUnconfirmed.mockResolvedValueOnce({ count: 2 });

      const result = await service.deleteUnconfirmed();

      expect(repoMock.deleteUnconfirmed).toHaveBeenCalled();
      expect(result).toEqual({ count: 2 });
    });
  });
});
