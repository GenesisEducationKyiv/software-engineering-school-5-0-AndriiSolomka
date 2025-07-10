import { Injectable } from '@nestjs/common';
import { AppConfig } from 'src/config/app.config';
import { SubscriptionParams } from 'src/core/abstracts/subscription/subscription-repository.interface';
import { SubscriptionInterface } from 'src/core/abstracts/subscription/subscription.interface';
import {
  Frequency,
  SubscriptionEntity,
} from 'src/core/entities/subscription.entity';
import { HttpClientService } from 'src/libs/http/http-client.service';

@Injectable()
export class SubscriptionApiClient implements SubscriptionInterface {
  constructor(
    private readonly httpClient: HttpClientService,
    private readonly config: AppConfig,
  ) {}

  async create(params: SubscriptionParams): Promise<SubscriptionEntity> {
    return await this.httpClient.post<SubscriptionEntity>(
      `${this.config.internalApiBaseUrl}/subscription`,
      params,
    );
  }

  async confirm(subscriptionId: number): Promise<SubscriptionEntity> {
    return await this.httpClient.post<SubscriptionEntity>(
      `${this.config.internalApiBaseUrl}/subscription/confirm/${subscriptionId}`,
      {},
    );
  }

  async delete(subscriptionId: number): Promise<SubscriptionEntity> {
    return await this.httpClient.post<SubscriptionEntity>(
      `${this.config.internalApiBaseUrl}/subscription/delete/${subscriptionId}`,
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
