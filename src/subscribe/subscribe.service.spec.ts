import { Test, TestingModule } from '@nestjs/testing';
import { SubscribeService } from './subscribe.service';
import { SubscriptionService } from 'src/subscription/subscription.service';
import { TokenService } from 'src/token/token.service';
import { EmailService } from 'src/email/email.service';
import { CreateSubscriptionDto } from './dto/create-subscribe.dto';
import { Frequency, Subscription, Token } from '@prisma/client';
/* eslint-disable @typescript-eslint/unbound-method */

describe('SubscribeService', () => {
  let service: SubscribeService;
  let subService: jest.Mocked<SubscriptionService>;
  let tokenService: jest.Mocked<TokenService>;
  let mailService: jest.Mocked<EmailService>;

  const mockSubscription: Subscription = {
    subscription_id: 1,
    email: 'test@example.com',
    city: 'Kyiv',
    frequency: Frequency.daily,
    confirmed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockToken: Token = {
    token_id: 1,
    token: 'abc123',
    subscription_id: 1,
    createdAt: new Date(),
    expiresAt: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubscribeService,
        {
          provide: SubscriptionService,
          useValue: {
            create: jest.fn(),
            confirm: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: TokenService,
          useValue: {
            create: jest.fn(),
            getEntity: jest.fn(),
          },
        },
        {
          provide: EmailService,
          useValue: {
            sendConfirmationEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SubscribeService>(SubscribeService);
    subService = module.get(SubscriptionService);
    tokenService = module.get(TokenService);
    mailService = module.get(EmailService);
  });

  describe('subscribe', () => {
    const dto: CreateSubscriptionDto = {
      email: 'test@example.com',
      city: 'Kyiv',
      frequency: Frequency.daily,
    };

    it('should create subscription, token and send confirmation email', async () => {
      subService.create.mockResolvedValue(mockSubscription);
      tokenService.create.mockResolvedValue(mockToken.token);
      mailService.sendConfirmationEmail.mockResolvedValue(undefined);

      const result = await service.subscribe(dto);

      expect(subService.create).toHaveBeenCalledWith(dto);
      expect(tokenService.create).toHaveBeenCalledWith(
        mockSubscription.subscription_id,
      );
      expect(mailService.sendConfirmationEmail).toHaveBeenCalledWith(
        dto.email,
        mockToken.token,
      );
      expect(result).toEqual({ message: 'Confirmation email sent' });
    });
  });

  describe('confirm', () => {
    it('should confirm subscription using token', async () => {
      tokenService.getEntity.mockResolvedValue(mockToken);
      subService.confirm.mockResolvedValue({
        ...mockSubscription,
        confirmed: true,
      });

      const result = await service.confirm('abc123');

      expect(tokenService.getEntity).toHaveBeenCalledWith('abc123');
      expect(subService.confirm).toHaveBeenCalledWith(
        mockToken.subscription_id,
      );
      expect(result).toEqual({
        message: 'Subscription confirmed successfully',
      });
    });
  });

  describe('unsubscribe', () => {
    it('should delete subscription using token', async () => {
      tokenService.getEntity.mockResolvedValue(mockToken);
      subService.delete.mockResolvedValue(mockSubscription);

      const result = await service.unsubscribe('abc123');

      expect(tokenService.getEntity).toHaveBeenCalledWith('abc123');
      expect(subService.delete).toHaveBeenCalledWith(mockToken.subscription_id);
      expect(result).toEqual({ message: 'Subscription deleted successfully' });
    });
  });
});
