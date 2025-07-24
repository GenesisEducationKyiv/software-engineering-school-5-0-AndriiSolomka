import { HttpClient } from 'src/libs/infrastructure/http/http-client.service';
import { appendToLogFile } from 'src/utils/logger/custom.logger';

export class LoggingHttpClient extends HttpClient {
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
