import { EmailService } from './email.service';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { EMAIL } from 'src/constants/enums/email/email.enum';
import { IEmailPayload } from 'src/constants/types/email/email.interface';

jest.mock('nodemailer');
const sendMailMock = jest.fn();

(nodemailer.createTransport as jest.Mock).mockReturnValue({
  sendMail: sendMailMock,
});

describe('EmailService', () => {
  let emailService: EmailService;
  let configService: ConfigService;

  beforeEach(() => {
    configService = {
      get: jest.fn((key: string) => {
        switch (key) {
          case 'EMAIL_USER':
            return 'test@example.com';
          case 'EMAIL_PASSWORD':
            return 'password';
          default:
            return null;
        }
      }),
    } as Partial<ConfigService> as ConfigService;

    emailService = new EmailService(configService);
    sendMailMock.mockClear();
  });

  it('should send confirmation email', async () => {
    const email = 'user@example.com';
    const token = 'abc123';

    await emailService.sendConfirmationEmail(email, token);

    expect(sendMailMock).toHaveBeenCalledWith({
      from: 'test@example.com',
      to: email,
      subject: EMAIL.SUBJECT,
      text: `${EMAIL.TEXT} ${EMAIL.CONFIRM_LINK}${token}`,
    });
  });

  it('should send weather email', async () => {
    const payload: IEmailPayload = {
      email: 'weather@example.com',
      subject: 'Weather Update',
      text: 'It’s sunny today!',
    };

    await emailService.sendWeatherEmail(payload);

    expect(sendMailMock).toHaveBeenCalledWith({
      from: 'test@example.com',
      to: payload.email,
      subject: payload.subject,
      text: payload.text,
    });
  });
});
