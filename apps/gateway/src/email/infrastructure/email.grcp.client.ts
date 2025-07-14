import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import {
  EMAIL_PACKAGE,
  EmailInterface,
  EmailPayload,
} from '../core/email.interface';

import type { GrpcToObservable } from 'libs/common/types/observable';

@Injectable()
export class EmailClientService implements OnModuleInit {
  private emailService: GrpcToObservable<EmailInterface>;

  constructor(
    @Inject(EMAIL_PACKAGE)
    private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.emailService =
      this.client.getService<GrpcToObservable<EmailInterface>>('EmailService');
  }

  async sendConfirmationEmail(email: string, token: string): Promise<void> {
    await firstValueFrom(
      this.emailService.sendConfirmationEmail({ email, token }),
    );
  }

  async sendWeatherEmail(payload: EmailPayload): Promise<void> {
    await firstValueFrom(this.emailService.sendWeatherEmail(payload));
  }
}
