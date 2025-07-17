import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';

import {
  EMAIL_PACKAGE,
  EmailInterface,
  EmailPayload,
} from '../../email/core/email.interface';

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

  async sendWeatherEmail(emailPayload: EmailPayload): Promise<void> {
    return this.emailService.sendWeatherEmail(emailPayload);
  }
}
