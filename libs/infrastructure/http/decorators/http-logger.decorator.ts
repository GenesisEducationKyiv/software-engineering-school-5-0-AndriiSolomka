import { HttpClientInterface } from 'libs/core/http/http-client.interface';
import { LoggerInterface } from 'libs/core/logger/logger.interface';
import { LoggingDecoratorBase } from 'libs/infrastructure/logger/logger.abstract';

export class LoggingHttpClient
  extends LoggingDecoratorBase<HttpClientInterface>
  implements HttpClientInterface
{
  constructor(
    protected readonly wrapped: HttpClientInterface,
    protected readonly logger: LoggerInterface,
  ) {
    super(wrapped, logger, 'HttpClient');
  }

  async get<T>(url: string): Promise<T> {
    return this.logAndExecute('http_get', { url }, () =>
      this.wrapped.get<T>(url),
    );
  }

  async post<T>(url: string, data: unknown): Promise<T> {
    return this.logAndExecute('http_post', { url, data }, () =>
      this.wrapped.post<T>(url, data),
    );
  }
}
