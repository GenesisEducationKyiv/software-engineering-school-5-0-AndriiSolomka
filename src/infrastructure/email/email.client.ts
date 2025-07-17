import { Injectable } from '@nestjs/common';
import { EmailInterface } from 'src/infrastructure/email/core/email.interface';
import { AppConfig } from 'src/libs/config/app.config';
import { HttpClientService } from 'src/libs/infrastructure/http/http-client.service';
import { SendWeatherEmailDto } from './interface/controllers/dto/send-weather-email.dto';


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
