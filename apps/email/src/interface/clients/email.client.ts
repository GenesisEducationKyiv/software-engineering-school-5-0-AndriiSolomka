import { Injectable } from '@nestjs/common';
import { EmailInterface } from 'apps/email/src/core/email.interface';
import { AppConfig } from 'libs/config/app.config';
import { HttpClientService } from 'libs/infrastructure/http/http-client.service';

import { SendWeatherEmailDto } from '../controllers/dto/email.dto';

@Injectable()
export class EmailApiClient implements EmailInterface {
  constructor(
    private httpClient: HttpClientService,
    private config: AppConfig,
  ) {}

  async sendConfirmationEmail(email: string, token: string): Promise<void> {
    await this.httpClient.post(
      `${this.config.internalApiBaseUrl}/email/send-confirmation`,
      { email, token },
    );
  }

  async sendWeatherEmail(emailPayload: SendWeatherEmailDto): Promise<void> {
    await this.httpClient.post(
      `${this.config.internalApiBaseUrl}/email/send-weather`,
      emailPayload,
    );
  }
}
