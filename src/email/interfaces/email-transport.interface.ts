export interface IEmailTransport {
  send(mailOptions: {
    to: string;
    subject: string;
    text: string;
  }): Promise<void>;
}

export const IEmailTransportToken = Symbol('IEmailTransport');
