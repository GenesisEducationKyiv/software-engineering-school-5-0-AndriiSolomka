import { LoggerInterface } from 'libs/core/logger/logger.interface';

export abstract class LoggingDecoratorBase<TWrapped> {
  constructor(
    protected readonly wrapped: TWrapped,
    protected readonly logger: LoggerInterface,
    protected readonly context: string,
  ) {}

  protected logSuccess(
    method: string,
    durationMs: number,
    params: Record<string, unknown> = {},
  ) {
    this.logger.info({
      context: this.context,
      method,
      event: 'success',
      durationMs,
      params,
    });
  }

  protected logError(
    method: string,
    durationMs: number,
    error: unknown,
    params: Record<string, unknown> = {},
  ) {
    this.logger.error({
      context: this.context,
      method,
      event: 'error',
      durationMs,
      params,
      error: error instanceof Error ? error.message : String(error),
    });
  }

  protected async logAndExecute<T>(
    methodName: string,
    params: Record<string, unknown>,
    fn: () => Promise<T>,
  ): Promise<T> {
    const start = Date.now();
    try {
      const result = await fn();
      const duration = Date.now() - start;
      this.logSuccess(methodName, duration, params);
      return result;
    } catch (error) {
      const duration = Date.now() - start;
      this.logError(methodName, duration, error, params);
      throw error;
    }
  }
}
