export const EmailTransportToken = Symbol('EmailTransport');

export interface EmailTransportInterface {
  send(mailOptions: {
    to: string;
    subject: string;
    text: string;
  }): Promise<void>;
}
