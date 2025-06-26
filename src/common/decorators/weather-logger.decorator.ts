import { FetchService } from 'src/fetch/fetch.service';
import { appendToLogFile } from 'src/utils/logger/custom.logger';

export class LoggingFetchService extends FetchService {
  constructor(
    private readonly wrapped: FetchService,
    private readonly enableLogging: boolean,
  ) {
    super();
  }

  async get<T>(url: string): Promise<T> {
    const result = await this.wrapped.get<T>(url);
    if (this.enableLogging) {
      const logMessage = `${url} - Response: ${JSON.stringify(result)}\n`;
      appendToLogFile(logMessage);
    }
    return result;
  }
}
