/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { SubscriptionDomainService } from './subscription-domain.service';
import { PrismaSubscriptionRepository } from './subscription-domain.repository';
import { Frequency, Subscription } from '@prisma/client';
import { CreateSubscriptionDto } from 'src/subscription-handlers/dto/create-subscription.dto';
import { SubWithTokens } from 'src/constants/types/prisma/subscription.type';

describe('SubscriptionService', () => {
  let service: SubscriptionDomainService;
  let repository: jest.Mocked<PrismaSubscriptionRepository>;

  const mockSubscription: Subscription = {
    subscription_id: 1,
    email: 'test@example.com',
    city: 'Kyiv',
    frequency: Frequency.daily,
    confirmed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockConfirmedSubscription: Subscription = {
    ...mockSubscription,
    confirmed: true,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubscriptionDomainService,
        {
          provide: PrismaSubscriptionRepository,
          useValue: {
            prisma: {},
            findOne: jest.fn(),
            create: jest.fn(),
            confirm: jest.fn(),
            delete: jest.fn(),
            findByFrequency: jest.fn(),
            deleteUnconfirmed: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SubscriptionDomainService>(SubscriptionDomainService);
    repository = module.get(PrismaSubscriptionRepository);

    jest.clearAllMocks();
  });

  describe('create', () => {
    const dto: CreateSubscriptionDto = {
      email: 'test@example.com',
      city: 'Kyiv',
      frequency: Frequency.daily,
    };

    it('should create subscription if not exists', async () => {
      repository.findOne.mockResolvedValue(null);
      repository.create.mockResolvedValue(mockSubscription);

      const result = await service.create(dto);

      expect(repository.findOne).toHaveBeenCalledWith(dto.email, dto.city);
      expect(repository.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockSubscription);
    });

    it('should throw ConflictException if subscription exists', async () => {
      repository.findOne.mockResolvedValue(mockSubscription);

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
      expect(repository.create).not.toHaveBeenCalled();
    });
  });

  describe('confirm', () => {
    it('should confirm a subscription by ID', async () => {
      repository.confirm.mockResolvedValue(mockConfirmedSubscription);

      const result = await service.confirm(1);

      expect(repository.confirm).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockConfirmedSubscription);
    });
  });

  describe('delete', () => {
    it('should delete a subscription by ID', async () => {
      repository.delete.mockResolvedValue(mockSubscription);

      const result = await service.delete(1);

      expect(repository.delete).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockSubscription);
    });
  });

  describe('getByFrequency', () => {
    const subsWithTokens: SubWithTokens[] = [
      {
        ...mockConfirmedSubscription,
        tokens: [
          {
            token_id: 1,
            token: 'abc',
            subscription_id: 1,
            createdAt: new Date(),
            expiresAt: null,
          },
        ],
      },
    ];

    it('should return subscriptions by frequency', async () => {
      repository.findByFrequency.mockResolvedValue(subsWithTokens);

      const result = await service.getByFrequency(Frequency.daily);

      expect(repository.findByFrequency).toHaveBeenCalledWith(Frequency.daily);
      expect(result).toEqual(subsWithTokens);
    });
  });

  describe('deleteUnconfirmed', () => {
    it('should delete unconfirmed subscriptions', async () => {
      const deleted = { count: 3 };
      repository.deleteUnconfirmed.mockResolvedValue(deleted);

      const result = await service.deleteUnconfirmed();

      expect(repository.deleteUnconfirmed).toHaveBeenCalledTimes(1);
      expect(result).toEqual(deleted);
    });
  });
});
