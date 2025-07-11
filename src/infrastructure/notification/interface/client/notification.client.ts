import { Injectable } from '@nestjs/common';
import { Frequency } from 'src/infrastructure/subscription-management/core/entities/subscription.entity';
import { AppConfig } from 'src/libs/config/app.config';
import { HttpClientService } from 'src/libs/infrastructure/http/http-client.service';

import { NotificationInterface } from '../../core/notification.interface';

@Injectable()
export class NotificationApiClient implements NotificationInterface {
  constructor(
    private readonly httpClient: HttpClientService,
    private readonly config: AppConfig,
  ) {}

  async sendWeatherUpdates(frequency: Frequency): Promise<void> {
    await this.httpClient.post<{ count: number }>(
      `${this.config.internalApiBaseUrl}/notification/send-updates`,
      { frequency },
    );
  }
}
