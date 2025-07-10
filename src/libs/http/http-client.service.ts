import { HttpException, Injectable } from '@nestjs/common';
import { HttpClientInterface } from 'src/core/abstracts/http/http-client.interface';

@Injectable()
export class HttpClientService implements HttpClientInterface {
  async get<T>(url: string): Promise<T> {
    const response = await fetch(url);

    if (!response.ok) {
      const errorMessage = `Failed to fetch data: ${response.status}, ${response.statusText}`;
      throw new HttpException(errorMessage, response.status);
    }

    return (await response.json()) as T;
  }

  async post<T>(url: string, data: unknown): Promise<T> {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorMessage = `Failed to post data: ${response.status}, ${response.statusText}`;
      throw new HttpException(errorMessage, response.status);
    }

    return (await response.json()) as T;
  }
}
