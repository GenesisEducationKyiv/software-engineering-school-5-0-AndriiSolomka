import { Test, TestingModule } from '@nestjs/testing';
import { EmailConfig } from 'apps/email/config/email.config';
import { EmailTransportToken } from 'apps/email/src/core/email-transport.interface';
import {
  EmailInterface,
  EmailToken,
} from 'apps/email/src/core/email.interface';
import { EmailService } from 'apps/email/src/infrastructure/services/email.service';

describe('EmailService', () => {
  let service: EmailInterface;

  const mockEmailTransport = {
    send: jest.fn(),
  };

  const mockConfig: EmailConfig = {
    user: 'test@example.com',
    password: 'password',
    service: 'gmail',
    confirmLink: 'https://confirm/',
    unsubscribeLink: 'https://unsubscribe/',
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: EmailTransportToken,
          useValue: mockEmailTransport,
        },
        {
          provide: EmailConfig,
          useValue: mockConfig,
        },
        {
          provide: EmailToken,
          useClass: EmailService,
        },
      ],
    }).compile();

    service = moduleRef.get<EmailInterface>(EmailToken);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should send confirmation email with correct subject and text', async () => {
    const email = 'user@example.com';
    const token = 'abc123';

    await service.sendConfirmationEmail(email, token);

    expect(mockEmailTransport.send).toHaveBeenCalledWith({
      to: email,
      subject: 'Subscription Confirmation',
      text: `Please confirm your Subscription by clicking the link: ${mockConfig.confirmLink}${token}`,
    });
  });

  it('should send weather email with correct payload', async () => {
    const payload = {
      email: 'user@example.com',
      subject: 'Weather Update',
      text: 'Today is sunny!',
    };

    await service.sendWeatherEmail(payload);

    expect(mockEmailTransport.send).toHaveBeenCalledWith({
      to: payload.email,
      subject: payload.subject,
      text: payload.text,
    });
  });

  it('should throw error if transport.send fails', async () => {
    mockEmailTransport.send.mockRejectedValue(new Error('Send failed'));

    await expect(
      service.sendWeatherEmail({
        email: 'user@example.com',
        subject: 'Test',
        text: 'Hello!',
      }),
    ).rejects.toThrow('Send failed');
  });
});
