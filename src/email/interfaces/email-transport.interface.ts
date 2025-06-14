export interface EmailTransport {
  send(mailOptions: {
    to: string;
    subject: string;
    text: string;
  }): Promise<void>;
}

export const EmailTransportToken = Symbol('IEmailTransport');
