import { HttpClientService } from 'src/http-client/http-client.service';
import { appendToLogFile } from 'src/utils/logger/custom.logger';

export class LoggingFetchService extends HttpClientService {
  constructor(
    private readonly wrapped: HttpClientService,
    private readonly enableLogging: boolean,
  ) {
    super();
  }

  async get<T>(url: string): Promise<T> {
    const result = await this.wrapped.get<T>(url);
    if (this.enableLogging) {
      appendToLogFile(`${url} - Response: ${JSON.stringify(result)}\n`);
    }
    return result;
  }
}
