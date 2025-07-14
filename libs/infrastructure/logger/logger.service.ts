import { Injectable } from '@nestjs/common';
import { LoggerInterface } from 'libs/core/logger/logger.interface';
import { APP_LOG_FILE_PATH } from 'libs/utils/logger/logger.config';
import { createPinoLogger } from 'libs/utils/logger/logger.factory';

@Injectable()
export class LoggerService implements LoggerInterface {
  private readonly logger = createPinoLogger(APP_LOG_FILE_PATH, true);

  log(message: string, ...args: unknown[]): void {
    this.logger.info(message, ...args);
  }
  error(message: string, ...args: unknown[]): void {
    this.logger.error(message, ...args);
  }
  warn(message: string, ...args: unknown[]): void {
    this.logger.warn(message, ...args);
  }
  debug(message: string, ...args: unknown[]): void {
    this.logger.debug(message, ...args);
  }
  verbose(message: string, ...args: unknown[]): void {
    this.logger.trace(message, ...args);
  }
}
