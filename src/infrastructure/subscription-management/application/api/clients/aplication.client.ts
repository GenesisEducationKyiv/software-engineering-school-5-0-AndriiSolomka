import { Injectable } from '@nestjs/common';
import { AppConfig } from 'src/config/app.config';
import { HttpClientService } from 'src/infrastructure/http/http-client.service';
import { SuccessResponseDto } from '../controllers/dto/handlers.dto';

export interface SubscriptionHandlersInterface {
  subscribe(params: {
    email: string;
    city: string;
    frequency: string;
  }): Promise<SuccessResponseDto>;
  confirm(token: string): Promise<SuccessResponseDto>;
  unsubscribe(token: string): Promise<SuccessResponseDto>;
}

@Injectable()
export class HandlersApiClient implements SubscriptionHandlersInterface {
  constructor(
    private readonly httpClient: HttpClientService,
    private readonly config: AppConfig,
  ) {}

  async subscribe(params: {
    email: string;
    city: string;
    frequency: string;
  }): Promise<SuccessResponseDto> {
    return await this.httpClient.post<SuccessResponseDto>(
      `${this.config.internalApiBaseUrl}/subscription`,
      params,
    );
  }

  async confirm(token: string): Promise<SuccessResponseDto> {
    return await this.httpClient.get<SuccessResponseDto>(
      `${this.config.internalApiBaseUrl}/subscription/confirm/${token}`,
    );
  }

  async unsubscribe(token: string): Promise<SuccessResponseDto> {
    return await this.httpClient.post<SuccessResponseDto>(
      `${this.config.internalApiBaseUrl}/subscription/unsubscribe/${token}`,
      {},
    );
  }
}
