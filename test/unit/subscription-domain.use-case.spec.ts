import { ConflictException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import {
  SubscriptionRepositoryInterface,
  SubscriptionRepositoryToken,
} from 'src/core/abstracts/subscription/subscription-repository.interface';
import {
  Frequency,
  SubscriptionEntity,
} from 'src/core/entities/subscription.entity';
import { SubscriptionDomainUseCase } from 'src/use-cases/subscription/subscription-domain.use-case';

function makeSubscription(): SubscriptionEntity {
  const now = new Date();
  return {
    subscriptionId: randomUUID(),
    email: 'test@mail.com',
    city: 'Kyiv',
    frequency: Frequency.Daily,
    confirmed: false,
    createdAt: now,
    updatedAt: now,
    tokens: [],
  };
}

describe('SubscriptionDomainUseCase', () => {
  let useCase: SubscriptionDomainUseCase;
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
        SubscriptionDomainUseCase,
        {
          provide: SubscriptionRepositoryToken,
          useValue: repoMock,
        },
      ],
    }).compile();

    useCase = module.get<SubscriptionDomainUseCase>(SubscriptionDomainUseCase);
  });

  describe('create', () => {
    it('should throw ConflictException if subscription exists', async () => {
      repoMock.findOne.mockResolvedValueOnce(makeSubscription());

      await expect(
        useCase.create({
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
      created.subscriptionId = randomUUID();

      repoMock.create.mockResolvedValueOnce(created);
      const result = await useCase.create({
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
      const id = randomUUID();
      const confirmed = makeSubscription();
      confirmed.subscriptionId = id;

      repoMock.confirm.mockResolvedValueOnce(confirmed);
      repoMock.confirm.mockResolvedValueOnce(confirmed);

      const result = await useCase.confirm(id);

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
      const result = await useCase.delete(id);

      expect(repoMock.delete).toHaveBeenCalledWith(id);
      expect(result).toBe(deleted);
    });
  });

  describe('deleteUnconfirmed', () => {
    it('should delete unconfirmed subscriptions', async () => {
      repoMock.deleteUnconfirmed.mockResolvedValueOnce({ count: 2 });

      const result = await useCase.deleteUnconfirmed();

      expect(repoMock.deleteUnconfirmed).toHaveBeenCalled();
      expect(result).toEqual({ count: 2 });
    });
  });
});
