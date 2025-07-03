import { appendToLogFile } from 'src/utils/logger/custom.logger';

import { HttpClientService } from '../http/http-client.service';

export class LoggingFetchService extends HttpClientService {
  constructor(
    private readonly wrapped: HttpClientService,
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
