import { Injectable } from '@nestjs/common';
import { LoggerConfig } from 'libs/config/logger.config';
import { LoggerInterface } from 'libs/core/logger/logger.interface';
import { APP_LOG_FILE_PATH } from 'libs/utils/logger/logger.config';
import { createPinoLogger } from 'libs/utils/logger/logger.factory';

@Injectable()
export class LoggerService implements LoggerInterface {
  private readonly logger = createPinoLogger(APP_LOG_FILE_PATH, true);

  constructor(private readonly config: LoggerConfig) {}

  private logIfEnabled(
    fn: (data: Record<string, unknown>) => void,
    data: Record<string, unknown>,
  ) {
    if (!this.config.enableLogging) return;
    fn.call(this.logger, data);
  }

  info(data: Record<string, unknown>): void {
    this.logIfEnabled(this.logger.info, data);
  }

  error(data: Record<string, unknown>): void {
    this.logIfEnabled(this.logger.error, data);
  }

  warn(data: Record<string, unknown>): void {
    this.logIfEnabled(this.logger.warn, data);
  }

  debug(data: Record<string, unknown>): void {
    if (!this.config.enableDebugLogging) return;
    this.logIfEnabled(this.logger.debug, data);
  }

  trace(data: Record<string, unknown>): void {
    this.logIfEnabled(this.logger.trace, data);
  }
}
