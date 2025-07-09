import { Injectable } from '@nestjs/common';
import { AppConfig } from 'src/config/app.config';
import { TokenInterface } from 'src/core/abstracts/token/token-interface';
import { TokenEntity } from 'src/core/entities/subscription.entity';
import { HttpClientService } from 'src/infrastructure/http/http-client.service';

@Injectable()
export class TokenApiClient implements TokenInterface {
  constructor(
    private readonly httpClient: HttpClientService,
    private readonly config: AppConfig,
  ) {}

  async create(subscriptionId: number): Promise<string> {
    return await this.httpClient.post<string>(
      `${this.config.internalApiBaseUrl}/token/create`,
      { subscriptionId },
    );
  }

  async getEntity(token: string): Promise<TokenEntity> {
    return await this.httpClient.get<TokenEntity>(
      `${this.config.internalApiBaseUrl}/token/${token}`,
    );
  }
}
