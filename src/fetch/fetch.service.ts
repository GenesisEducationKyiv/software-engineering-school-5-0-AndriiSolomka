import { HttpException, Injectable } from '@nestjs/common';
import type { IFetchService } from 'src/fetch/interfaces/fetch-service.interface';
import { AppLoggerService } from 'src/logger/app-logger.service';

@Injectable()
export class FetchService implements IFetchService {
  constructor(private readonly logger: AppLoggerService) {}

  async get<T>(url: string): Promise<T> {
    const response = await fetch(url);

    if (!response.ok) {
      const errorMessage = `Failed to fetch data: ${response.status}, ${response.statusText}`;
      this.logger.error(`${url}, ${errorMessage}`);
      throw new HttpException(errorMessage, response.status);
    }

    return (await response.json()) as T;
  }
}
