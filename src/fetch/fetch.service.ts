import { HttpException, Injectable } from '@nestjs/common';
import type { IFetchService } from 'src/fetch/interfaces/fetch-service.interface';

@Injectable()
export class FetchService implements IFetchService {
  async get<T>(url: string): Promise<T> {
    const response = await fetch(url);

    if (!response.ok) {
      const errorMessage = `Failed to fetch data: ${response.status}, ${response.statusText}`;
      throw new HttpException(errorMessage, response.status);
    }

    return (await response.json()) as T;
  }
}
