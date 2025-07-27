import { Inject } from '@nestjs/common';
import { HttpClientInterface } from 'libs/core/http/http-client.interface';
import {
  LoggerInterface,
  LoggerToken,
} from 'libs/core/logger/logger.interface';

export class LoggingHttpClient implements HttpClientInterface {
  constructor(
    private readonly wrapped: HttpClientInterface,
    @Inject(LoggerToken)
    private readonly logger: LoggerInterface,
  ) {}

  async get<T>(url: string): Promise<T> {
    try {
      const result = await this.wrapped.get<T>(url);
      this.logger.info({
        context: 'HttpClient',
        operation: 'http_get',
        url,
        status: 'success',
      });
      return result;
    } catch (error) {
      this.logger.error({
        context: 'HttpClient',
        operation: 'http_get',
        url,
        status: 'fail',
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  async post<T>(url: string, data: unknown): Promise<T> {
    try {
      const result = await this.wrapped.post<T>(url, data);
      this.logger.info({
        context: 'HttpClient',
        operation: 'http_post',
        url,
        status: 'success',
      });
      return result;
    } catch (error) {
      this.logger.error({
        context: 'HttpClient',
        operation: 'http_post',
        url,
        status: 'fail',
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }
}
