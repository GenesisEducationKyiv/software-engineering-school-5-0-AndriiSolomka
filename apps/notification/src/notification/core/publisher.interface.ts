export interface EmailPublisherInterface {
  publishEmail(email: string, subject: string, text: string): void;
}
