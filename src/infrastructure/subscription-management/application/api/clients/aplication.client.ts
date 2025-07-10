import { Injectable } from '@nestjs/common';
import { AppConfig } from 'src/config/app.config';
import { HttpClientService } from 'src/infrastructure/libs/http/http-client.service';

@Injectable()
export class HandlersApiClient {
  constructor(
    private readonly httpClient: HttpClientService,
    private readonly config: AppConfig,
  ) {}

  async subscribe(params: { email: string; city: string; frequency: string }) {
    return await this.httpClient.post(
      `${this.config.internalApiBaseUrl}/subscription`,
      params,
    );
  }

  async confirm(token: string) {
    return await this.httpClient.get(
      `${this.config.internalApiBaseUrl}/subscription/confirm/${token}`,
    );
  }

  async unsubscribe(token: string) {
    return await this.httpClient.post(
      `${this.config.internalApiBaseUrl}/subscription/unsubscribe/${token}`,
      {},
    );
  }
}
