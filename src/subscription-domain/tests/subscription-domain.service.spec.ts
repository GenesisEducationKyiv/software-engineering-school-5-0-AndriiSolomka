import { ConflictException } from '@nestjs/common';
import { SubscriptionDomainService } from '../subscription-domain.service';
import {
  SubscriptionRepository,
  SubscriptionRepositoryToken,
} from '../interfaces/subscription-repository.interface';
import { Frequency, Subscription, Token } from '@prisma/client';
import { ISubscriptionDomainService } from '../interfaces/subscription-service.interface';
import { Test } from '@nestjs/testing';

function makeSubscription(): Subscription {
  const now = new Date();
  return {
    subscription_id: 1,
    email: 'test@mail.com',
    city: 'Kyiv',
    frequency: Frequency.daily,
    confirmed: false,
    createdAt: now,
    updatedAt: now,
  };
}

function makeToken(): Token {
  const now = new Date();
  return {
    token_id: 1,
    token: 'sometoken',
    subscription_id: 1,
    createdAt: now,
    expiresAt: null,
  };
}

describe('SubscriptionDomainService', () => {
  let service: ISubscriptionDomainService;
  let repoMock: jest.Mocked<
    Pick<
      SubscriptionRepository,
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
        SubscriptionDomainService,
        {
          provide: SubscriptionRepositoryToken,
          useValue: repoMock,
        },
      ],
    }).compile();

    service = module.get<SubscriptionDomainService>(SubscriptionDomainService);
  });

  describe('create', () => {
    it('should throw ConflictException if subscription exists', async () => {
      const dto = {
        email: 'test@mail.com',
        city: 'Kyiv',
        frequency: Frequency.daily,
      };
      repoMock.findOne.mockResolvedValueOnce(makeSubscription());

      await expect(service.create(dto)).rejects.toBeInstanceOf(
        ConflictException,
      );
      expect(repoMock.findOne).toHaveBeenCalledWith(dto.email, dto.city);
      expect(repoMock.create).not.toHaveBeenCalled();
    });

    it('should create subscription if not exists', async () => {
      const dto = {
        email: 'test@mail.com',
        city: 'Kyiv',
        frequency: Frequency.daily,
      };
      repoMock.findOne.mockResolvedValueOnce(null);
      const created = makeSubscription();
      created.subscription_id = 2;

      repoMock.create.mockResolvedValueOnce(created);
      const result = await service.create(dto);

      expect(repoMock.findOne).toHaveBeenCalledWith(dto.email, dto.city);
      expect(repoMock.create).toHaveBeenCalledWith(dto);
      expect(result).toBe(created);
    });
  });

  describe('preventDuplicate', () => {
    it('should throw ConflictException if subscription exists', async () => {
      const existing = makeSubscription();
      existing.subscription_id = 3;

      repoMock.findOne.mockResolvedValueOnce(existing);
      await expect(
        service.preventDuplicate('test@mail.com', 'Kyiv'),
      ).rejects.toBeInstanceOf(ConflictException);
    });

    it('should return undefined if subscription does not exist', async () => {
      repoMock.findOne.mockResolvedValueOnce(null);

      const result = await service.preventDuplicate('test@mail.com', 'Kyiv');
      expect(result).toBeUndefined();
    });
  });

  describe('confirm', () => {
    it('should confirm subscription', async () => {
      const confirmed = makeSubscription();
      confirmed.subscription_id = 4;

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
      deleted.subscription_id = 5;

      repoMock.delete.mockResolvedValueOnce(deleted);
      const result = await service.delete(5);

      expect(repoMock.delete).toHaveBeenCalledWith(5);
      expect(result).toBe(deleted);
    });
  });

  describe('getByFrequency', () => {
    it('should return subscriptions by frequency', async () => {
      const freq = Frequency.daily;
      const sub = makeSubscription();
      const token = makeToken();
      token.subscription_id = 6;

      const subs = [{ ...sub, tokens: [token] }];
      repoMock.findByFrequency.mockResolvedValueOnce(subs);

      const result = await service.getByFrequency(freq);

      expect(repoMock.findByFrequency).toHaveBeenCalledWith(freq);
      expect(result).toBe(subs);
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
