import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';

import { EMAIL_PACKAGE, EmailInterface } from '../core/email.interface';

@Injectable()
export class EmailClientService implements OnModuleInit {
  private emailService: EmailInterface;

  constructor(
    @Inject(EMAIL_PACKAGE)
    private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.emailService = this.client.getService<EmailInterface>('EmailService');
  }

  async sendConfirmationEmail(email: string, token: string): Promise<void> {
    return this.emailService.sendConfirmationEmail(email, token);
  }
}
