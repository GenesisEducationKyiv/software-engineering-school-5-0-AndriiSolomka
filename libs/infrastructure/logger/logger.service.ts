import { Injectable } from '@nestjs/common';
import { LoggerConfig } from 'libs/config/logger.config';
import { LoggerInterface } from 'libs/core/logger/logger.interface';
import { createPinoLogger } from 'libs/utils/logger/logger.factory';
import { Logger } from 'pino';

@Injectable()
export class LoggerService implements LoggerInterface {
  private readonly logger: Logger | null;

  constructor(private readonly config: LoggerConfig) {
    if (this.config.enableLogging) {
      this.logger = createPinoLogger(this.config.filePath, true);
    } else {
      this.logger = null;
    }
  }

  info(data: Record<string, unknown>): void {
    this.logger?.info(data);
  }

  error(data: Record<string, unknown>): void {
    this.logger?.error(data);
  }

  warn(data: Record<string, unknown>): void {
    this.logger?.warn(data);
  }

  debug(data: Record<string, unknown>): void {
    if (!this.config.enableDebugLogging) return;
    this.logger?.debug(data);
  }

  trace(data: Record<string, unknown>): void {
    this.logger?.trace(data);
  }
}
