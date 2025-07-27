import { Test } from '@nestjs/testing';
import {
  Frequency,
  TokenEntity,
} from 'apps/subscription/src/core/entities/subscription.entity';
import { SubscriptionParams } from 'apps/subscription/src/core/subscription/subscription-repository.interface';
import { SubscriptionApplicationService } from 'apps/subscription/src/infrastructure/services/subscription-application.service';
import { SubscriptionService } from 'apps/subscription/src/infrastructure/services/subscription.service';
import { TokenService } from 'apps/subscription/src/infrastructure/services/token.service';
import { randomUUID } from 'crypto';

function makeToken(
  id = randomUUID(),
  subscriptionId = randomUUID(),
): TokenEntity {
  const now = new Date();
  return {
    tokenId: id,
    token: 'test-token-123',
    subscriptionId: subscriptionId,
    createdAt: now,
    expiresAt: new Date(now.getTime() + 24 * 60 * 60 * 1000),
  };
}

describe('SubscriptionApplicationService (unit)', () => {
  let service: SubscriptionApplicationService;
  let subServiceMock: jest.Mocked<
    Pick<
      SubscriptionService,
      'create' | 'confirm' | 'delete' | 'getByFrequency' | 'deleteUnconfirmed'
    >
  >;
  let tokenServiceMock: jest.Mocked<Pick<TokenService, 'create' | 'getEntity'>>;

  beforeEach(async () => {
    subServiceMock = {
      create: jest.fn(),
      confirm: jest.fn(),
      delete: jest.fn(),
      getByFrequency: jest.fn(),
      deleteUnconfirmed: jest.fn(),
    };

    tokenServiceMock = {
      create: jest.fn(),
      getEntity: jest.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [
        SubscriptionApplicationService,
        {
          provide: SubscriptionService,
          useValue: subServiceMock,
        },
        {
          provide: TokenService,
          useValue: tokenServiceMock,
        },
      ],
    }).compile();

    service = module.get<SubscriptionApplicationService>(
      SubscriptionApplicationService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('subscribe', () => {
    it('should create subscription and generate token', async () => {
      const params = {
        email: 'test@example.com',
        city: 'Kyiv',
        frequency: Frequency.daily,
      };

      const mockSubscription = {
        subscriptionId: randomUUID(),
        email: 'test@example.com',
        city: 'Kyiv',
        frequency: Frequency.daily,
        confirmed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        tokens: [],
      };

      const mockToken = 'test-token-123';

      subServiceMock.create.mockResolvedValueOnce(mockSubscription);
      tokenServiceMock.create.mockResolvedValueOnce(mockToken);

      await service.subscribe(params);

      expect(subServiceMock.create).toHaveBeenCalledWith(params);
      expect(tokenServiceMock.create).toHaveBeenCalledWith(
        mockSubscription.subscriptionId,
      );
    });

    it('should throw error when subscription creation fails', async () => {
      const params: SubscriptionParams = {
        email: 'test@example.com',
        city: 'Kyiv',
        frequency: Frequency.daily,
      };

      const error = new Error('Failed to create subscription');
      subServiceMock.create.mockRejectedValueOnce(error);

      await expect(service.subscribe(params)).rejects.toThrow(error);
      expect(tokenServiceMock.create).not.toHaveBeenCalled();
    });
  });

  describe('confirm', () => {
    it('should confirm subscription by token', async () => {
      const token = 'valid-token';
      const tokenEntity = makeToken();

      tokenServiceMock.getEntity.mockResolvedValueOnce(tokenEntity);

      subServiceMock.confirm.mockResolvedValueOnce({
        subscriptionId: randomUUID(),
        email: 'test@example.com',
        city: 'Kyiv',
        frequency: Frequency.daily,
        confirmed: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        tokens: [],
      });

      const result = await service.confirm(token);

      expect(tokenServiceMock.getEntity).toHaveBeenCalledWith(token);
      expect(subServiceMock.confirm).toHaveBeenCalledWith(
        tokenEntity.subscriptionId,
      );
      expect(result).toEqual({
        message: 'Subscription confirmed successfully',
      });
    });

    it('should throw error when token is invalid', async () => {
      const token = 'invalid-token';
      const error = new Error('Token not found');

      tokenServiceMock.getEntity.mockRejectedValueOnce(error);

      await expect(service.confirm(token)).rejects.toThrow(error);
      expect(subServiceMock.confirm).not.toHaveBeenCalled();
    });
  });

  describe('unsubscribe', () => {
    it('should delete subscription by token', async () => {
      const token = 'valid-token';
      const tokenEntity = makeToken();

      tokenServiceMock.getEntity.mockResolvedValueOnce(tokenEntity);
      subServiceMock.delete.mockResolvedValueOnce({
        subscriptionId: randomUUID(),
        email: 'test@example.com',
        city: 'Kyiv',
        frequency: Frequency.daily,
        confirmed: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        tokens: [],
      });

      const result = await service.unsubscribe(token);

      expect(tokenServiceMock.getEntity).toHaveBeenCalledWith(token);
      expect(subServiceMock.delete).toHaveBeenCalledWith(
        tokenEntity.subscriptionId,
      );
      expect(result).toEqual({ message: 'Subscription deleted successfully' });
    });

    it('should throw error when token is invalid', async () => {
      const token = 'invalid-token';
      const error = new Error('Token not found');

      tokenServiceMock.getEntity.mockRejectedValueOnce(error);

      await expect(service.unsubscribe(token)).rejects.toThrow(error);
      expect(subServiceMock.delete).not.toHaveBeenCalled();
    });
  });

  describe('getByFrequency', () => {
    it('should return subscriptions by frequency', async () => {
      const frequency = Frequency.daily;
      const mockSubs = [
        {
          subscriptionId: randomUUID(),
          email: 'a@example.com',
          city: 'Kyiv',
          frequency,
          confirmed: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          tokens: [],
        },
        {
          subscriptionId: randomUUID(),
          email: 'b@example.com',
          city: 'Lviv',
          frequency,
          confirmed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          tokens: [],
        },
      ];

      subServiceMock.getByFrequency = jest.fn().mockResolvedValue(mockSubs);

      const result = await service.getByFrequency(frequency);

      expect(subServiceMock.getByFrequency).toHaveBeenCalledWith(frequency);
      expect(result).toEqual(mockSubs);
    });
  });

  describe('deleteUnconfirmed', () => {
    it('should delete unconfirmed subscriptions and return count', async () => {
      const mockResult = { count: 5 };

      subServiceMock.deleteUnconfirmed = jest
        .fn()
        .mockResolvedValue(mockResult);

      const result = await service.deleteUnconfirmed();

      expect(subServiceMock.deleteUnconfirmed).toHaveBeenCalled();
      expect(result).toEqual(mockResult);
    });
  });
});
