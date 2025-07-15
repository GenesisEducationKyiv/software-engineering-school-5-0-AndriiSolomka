import { Test } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import {
  EmailInterface,
  EmailToken,
} from 'src/core/abstracts/email/email.interface';
import { SubscriptionParams } from 'src/core/abstracts/subscription/subscription-repository.interface';
import { Frequency, TokenEntity } from 'src/core/entities/subscription.entity';
import { SubscriptionDomainUseCase } from 'src/use-cases/subscription/subscription-domain.use-case';
import { SubscriptionHandlersUseCase } from 'src/use-cases/subscription/subscription-handler.use-case';
import { TokenUseCase } from 'src/use-cases/token/token.use-case';

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

describe('SubscriptionHandlersUseCase', () => {
  let useCase: SubscriptionHandlersUseCase;
  let subServiceMock: jest.Mocked<
    Pick<SubscriptionDomainUseCase, 'create' | 'confirm' | 'delete'>
  >;
  let tokenServiceMock: jest.Mocked<Pick<TokenUseCase, 'create' | 'getEntity'>>;
  let mailServiceMock: jest.Mocked<
    Pick<EmailInterface, 'sendConfirmationEmail'>
  >;

  beforeEach(async () => {
    subServiceMock = {
      create: jest.fn(),
      confirm: jest.fn(),
      delete: jest.fn(),
    };

    tokenServiceMock = {
      create: jest.fn(),
      getEntity: jest.fn(),
    };

    mailServiceMock = {
      sendConfirmationEmail: jest.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [
        SubscriptionHandlersUseCase,
        {
          provide: SubscriptionDomainUseCase,
          useValue: subServiceMock,
        },
        {
          provide: TokenUseCase,
          useValue: tokenServiceMock,
        },
        {
          provide: EmailToken,
          useValue: mailServiceMock,
        },
      ],
    }).compile();

    useCase = module.get<SubscriptionHandlersUseCase>(
      SubscriptionHandlersUseCase,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('subscribe', () => {
    it('should create subscription, generate token and send confirmation email', async () => {
      const params: SubscriptionParams = {
        email: 'test@example.com',
        city: 'Kyiv',
        frequency: Frequency.Daily,
      };

      const mockSubscription = {
        subscriptionId: randomUUID(),
        email: 'test@example.com',
        city: 'Kyiv',
        frequency: Frequency.Daily,
        confirmed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        tokens: [],
      };

      const mockToken = 'test-token-123';

      subServiceMock.create.mockResolvedValueOnce(mockSubscription);
      tokenServiceMock.create.mockResolvedValueOnce(mockToken);
      mailServiceMock.sendConfirmationEmail.mockResolvedValueOnce(undefined);

      const result = await useCase.subscribe(params);

      expect(subServiceMock.create).toHaveBeenCalledWith(params);
      expect(tokenServiceMock.create).toHaveBeenCalledWith(
        mockSubscription.subscriptionId,
      );
      expect(mailServiceMock.sendConfirmationEmail).toHaveBeenCalledWith(
        params.email,
        mockToken,
      );
      expect(result).toEqual({ message: 'Confirmation email sent' });
    });

    it('should throw error when subscription creation fails', async () => {
      const params: SubscriptionParams = {
        email: 'test@example.com',
        city: 'Kyiv',
        frequency: Frequency.Daily,
      };

      const error = new Error('Failed to create subscription');
      subServiceMock.create.mockRejectedValueOnce(error);

      await expect(useCase.subscribe(params)).rejects.toThrow(error);
      expect(tokenServiceMock.create).not.toHaveBeenCalled();
      expect(mailServiceMock.sendConfirmationEmail).not.toHaveBeenCalled();
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
        frequency: Frequency.Daily,
        confirmed: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        tokens: [],
      });

      const result = await useCase.confirm(token);

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

      await expect(useCase.confirm(token)).rejects.toThrow(error);
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
        frequency: Frequency.Daily,
        confirmed: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        tokens: [],
      });

      const result = await useCase.unsubscribe(token);

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

      await expect(useCase.unsubscribe(token)).rejects.toThrow(error);
      expect(subServiceMock.delete).not.toHaveBeenCalled();
    });
  });
});
