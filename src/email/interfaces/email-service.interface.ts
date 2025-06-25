import { IEmailPayload } from 'src/constants/types/email/email.interface';

export interface IEmailService {
  sendConfirmationEmail(email: string, token: string): Promise<void>;
  sendWeatherEmail(emailPayload: IEmailPayload): Promise<void>;
}
