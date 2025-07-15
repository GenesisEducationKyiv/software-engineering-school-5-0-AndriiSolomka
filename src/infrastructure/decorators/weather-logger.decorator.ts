import { appendToLogFile } from 'src/utils/logger/custom.logger';

import { HttpClient } from '../http/http-client';

export class HttpClientWithLogging extends HttpClient {
  constructor(
    private readonly wrapped: HttpClient,
    private readonly enableLogging: boolean,
    private readonly fileName: string,
  ) {
    super();
  }

  async get<T>(url: string): Promise<T> {
    const result = await this.wrapped.get<T>(url);
    if (this.enableLogging) {
      appendToLogFile(
        `${url} - Response: ${JSON.stringify(result)}\n`,
        this.fileName,
      );
    }
    return result;
  }
}
