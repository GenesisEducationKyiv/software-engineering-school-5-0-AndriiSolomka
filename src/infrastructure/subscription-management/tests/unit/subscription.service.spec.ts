import { ConflictException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import {
  Frequency,
  SubscriptionEntity,
} from 'src/infrastructure/subscription-management/core/entities/subscription.entity';
import {
  SubscriptionRepositoryInterface,
  SubscriptionRepositoryToken,
} from 'src/infrastructure/subscription-management/core/subscription/subscription-repository.interface';
import { SubscriptionInterface } from 'src/infrastructure/subscription-management/core/subscription/subscription.interface';
import { SubscriptionService } from 'src/infrastructure/subscription-management/infrastructure/services/subscription.service';

function makeSubscription(): SubscriptionEntity {
  const now = new Date();
  return {
    subscriptionId: 1,
    email: 'test@mail.com',
    city: 'Kyiv',
    frequency: Frequency.Daily,
    confirmed: false,
    createdAt: now,
    updatedAt: now,
    tokens: [],
  };
}

describe('SubscriptionService', () => {
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

    const module = await Test.createTestingModule({
      providers: [
        SubscriptionService,
        {
          provide: SubscriptionRepositoryToken,
          useValue: repoMock,
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
          frequency: Frequency.Daily,
        }),
      ).rejects.toBeInstanceOf(ConflictException);

      expect(repoMock.findOne).toHaveBeenCalledWith('test@mail.com', 'Kyiv');
      expect(repoMock.create).not.toHaveBeenCalled();
    });

    it('should create subscription if not exists', async () => {
      repoMock.findOne.mockResolvedValueOnce(null);
      const created = makeSubscription();
      created.subscriptionId = 2;

      repoMock.create.mockResolvedValueOnce(created);
      const result = await service.create({
        email: 'test@mail.com',
        city: 'Kyiv',
        frequency: Frequency.Daily,
      });

      expect(repoMock.findOne).toHaveBeenCalledWith('test@mail.com', 'Kyiv');
      expect(repoMock.create).toHaveBeenCalledWith({
        email: 'test@mail.com',
        city: 'Kyiv',
        frequency: Frequency.Daily,
      });
      expect(result).toBe(created);
    });
  });

  describe('confirm', () => {
    it('should confirm subscription', async () => {
      const confirmed = makeSubscription();
      confirmed.subscriptionId = 4;

      repoMock.confirm.mockResolvedValueOnce(confirmed);
      repoMock.confirm.mockResolvedValueOnce(confirmed);

      const result = await service.confirm(4);

      expect(repoMock.confirm).toHaveBeenCalledWith(4);
      expect(result).toBe(confirmed);
    });
  });

  describe('delete', () => {
    it('should delete subscription', async () => {
      const deleted = makeSubscription();
      deleted.subscriptionId = 5;

      repoMock.delete.mockResolvedValueOnce(deleted);
      const result = await service.delete(5);

      expect(repoMock.delete).toHaveBeenCalledWith(5);
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
