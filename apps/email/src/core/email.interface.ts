export type EmailPayload = {
  email: string;
  subject: string;
  text: string;
};

export const EmailToken = Symbol('EmailToken');

export interface EmailInterface {
  sendConfirmationEmail(email: string, token: string): Promise<void>;
  sendWeatherEmail(emailPayload: EmailPayload): Promise<void>;
}
