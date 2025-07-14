export interface EmailPayload {
  email: string;
  subject: string;
  text: string;
}

export const EMAIL_PACKAGE = Symbol('EMAIL_PACKAGE');

export interface EmailInterface {
  sendWeatherEmail(emailPayload: EmailPayload): Promise<void>;
}
