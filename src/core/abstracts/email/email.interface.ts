export interface EmailPayload {
  email: string;
  subject: string;
  text: string;
}

export interface EmailInterface {
  sendConfirmationEmail(email: string, token: string): Promise<void>;
  sendWeatherEmail(emailPayload: EmailPayload): Promise<void>;
}
