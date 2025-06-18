import { ConflictException } from '@nestjs/common';
import { SubscriptionDomainService } from '../subscription-domain.service';
import {
  SubscriptionRepository,
  SubscriptionRepositoryToken,
} from '../interfaces/subscription-repository.interface';
import { CreateSubscriptionDto } from 'src/subscription-handlers/dto/create-subscription.dto';
import { Frequency, Subscription } from '@prisma/client';
import { SubWithTokens } from 'src/constants/types/prisma/subscription.type';
import { ISubscriptionDomainService } from '../interfaces/subscription-service.interface';
import { Test } from '@nestjs/testing';

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
      const dto: CreateSubscriptionDto = {
        email: 'test@mail.com',
        city: 'Kyiv',
        frequency: Frequency.daily,
      };
      repoMock.findOne.mockResolvedValueOnce({} as Subscription);

      await expect(service.create(dto)).rejects.toBeInstanceOf(
        ConflictException,
      );
      expect(repoMock.findOne).toHaveBeenCalledWith(dto.email, dto.city);
      expect(repoMock.create).not.toHaveBeenCalled();
    });

    it('should create subscription if not exists', async () => {
      const dto: CreateSubscriptionDto = {
        email: 'test@mail.com',
        city: 'Kyiv',
        frequency: Frequency.daily,
      };
      repoMock.findOne.mockResolvedValueOnce(null);
      const created = { subscription_id: 1 } as Subscription;
      repoMock.create.mockResolvedValueOnce(created);

      const result = await service.create(dto);

      expect(repoMock.findOne).toHaveBeenCalledWith(dto.email, dto.city);
      expect(repoMock.create).toHaveBeenCalledWith(dto);
      expect(result).toBe(created);
    });
  });

  describe('preventDuplicate', () => {
    it('should throw ConflictException if subscription exists', async () => {
      repoMock.findOne.mockResolvedValueOnce({} as Subscription);

      await expect(
        service.preventDuplicate('test@mail.com', 'Kyiv'),
      ).rejects.toBeInstanceOf(ConflictException);
    });

    it('should return null if subscription does not exist', async () => {
      repoMock.findOne.mockResolvedValueOnce(null);

      const result = await service.preventDuplicate('test@mail.com', 'Kyiv');
      expect(result).toBeUndefined();
    });
  });

  describe('confirm', () => {
    it('should confirm subscription', async () => {
      const confirmed = { subscription_id: 1 } as Subscription;
      repoMock.confirm.mockResolvedValueOnce(confirmed);

      const result = await service.confirm(1);

      expect(repoMock.confirm).toHaveBeenCalledWith(1);
      expect(result).toBe(confirmed);
    });
  });

  describe('delete', () => {
    it('should delete subscription', async () => {
      const deleted = { subscription_id: 1 } as Subscription;
      repoMock.delete.mockResolvedValueOnce(deleted);

      const result = await service.delete(1);

      expect(repoMock.delete).toHaveBeenCalledWith(1);
      expect(result).toBe(deleted);
    });
  });

  describe('getByFrequency', () => {
    it('should return subscriptions by frequency', async () => {
      const freq = Frequency.daily;
      const subs: SubWithTokens[] = [{ subscription_id: 1 } as SubWithTokens];
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
