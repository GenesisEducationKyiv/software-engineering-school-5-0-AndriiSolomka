import { Test, TestingModule } from '@nestjs/testing';
import * as nodemailer from 'nodemailer';

import { EmailConfig } from '../../config/email.config';
import {
  EmailTransportInterface,
  EmailTransportToken,
} from '../../core/email-transport.interface';
import { NodemailerService } from '../../infrastructure/providers/nodemailer.provider';

jest.mock('nodemailer');

describe('NodemailerService', () => {
  let service: EmailTransportInterface;

  const mockSendMail = jest.fn();
  const mockCreateTransport = nodemailer.createTransport as jest.Mock;

  const mockConfig: EmailConfig = {
    user: 'test@example.com',
    password: 'password',
    service: 'gmail',
    confirmLink: 'https://confirm/',
    unsubscribeLink: 'https://unsubscribe/',
  };

  beforeEach(async () => {
    mockCreateTransport.mockReturnValue({ sendMail: mockSendMail });

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: EmailConfig,
          useValue: mockConfig,
        },
        {
          provide: EmailTransportToken,
          useClass: NodemailerService,
        },
      ],
    }).compile();

    service = moduleRef.get<EmailTransportInterface>(EmailTransportToken);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should send email with correct options', async () => {
    const mailOptions = {
      to: 'user@example.com',
      subject: 'Test Subject',
      text: 'Test email body',
    };

    await service.send(mailOptions);

    expect(mockSendMail).toHaveBeenCalledWith({
      from: mockConfig.user,
      to: mailOptions.to,
      subject: mailOptions.subject,
      text: mailOptions.text,
    });
  });

  it('should throw an error if sendMail fails', async () => {
    mockSendMail.mockRejectedValueOnce(new Error('Failed to send'));

    await expect(
      service.send({
        to: 'user@example.com',
        subject: 'Error Test',
        text: 'Should fail',
      }),
    ).rejects.toThrow('Failed to send');
  });
});
