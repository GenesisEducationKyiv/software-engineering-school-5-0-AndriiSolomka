import { appendToLogFile } from 'libs/utils/logger/custom.logger';

import { HttpClientService } from '../http-client.service';

export class LoggingHttpClientService extends HttpClientService {
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
