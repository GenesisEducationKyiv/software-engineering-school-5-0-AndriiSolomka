import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AppLoggerService } from 'src/logger/app-logger.service';

@Injectable()
export class FetchService {
  constructor(private readonly logger: AppLoggerService) {}
  async get<T>(url: string): Promise<T> {
    const response = await fetch(url);

    if (!response.ok) {
      this.logger.error('Fetch Error', response);
      throw new HttpException(
        `Failed to fetch data: ${response.statusText}`,
        HttpStatus.BAD_GATEWAY,
      );
    }

    return (await response.json()) as T;
  }
}
