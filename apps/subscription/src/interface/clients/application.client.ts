import { Injectable } from '@nestjs/common';
import { AppConfig } from 'libs/config/app.config';
import { HttpClientService } from 'libs/infrastructure/http/http-client.service';

import {
  Frequency,
  SubscriptionEntity,
} from '../../core/entities/subscription.entity';

@Injectable()
export class SubscriptionApiClient {
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

  async getByFrequency(frequency: Frequency): Promise<SubscriptionEntity[]> {
    return await this.httpClient.get<SubscriptionEntity[]>(
      `${this.config.internalApiBaseUrl}/subscription/by-frequency/${frequency}`,
    );
  }

  async deleteUnconfirmed(): Promise<{ count: number }> {
    return await this.httpClient.post<{ count: number }>(
      `${this.config.internalApiBaseUrl}/subscription/delete-unconfirmed`,
      {},
    );
  }
}
