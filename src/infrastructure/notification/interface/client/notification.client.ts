import { Injectable } from '@nestjs/common';
import { AppConfig } from 'src/config/app.config';
import { Frequency } from 'src/core/entities/subscription.entity';
import { NotificationInterface } from 'src/infrastructure/notification/core/notification.interface';
import { HttpClientService } from 'src/libs/http/http-client.service';

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
