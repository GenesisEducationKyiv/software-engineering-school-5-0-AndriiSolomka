import { Injectable } from '@nestjs/common';
import { LoggerInterface } from 'libs/core/logger/logger.interface';
import { APP_LOG_FILE_PATH } from 'libs/utils/logger/logger.config';
import { createPinoLogger } from 'libs/utils/logger/logger.factory';

@Injectable()
export class LoggerService implements LoggerInterface {
  private readonly logger = createPinoLogger(APP_LOG_FILE_PATH, true);

  log(data: Record<string, unknown>): void {
    this.logger.info(data);
  }

  error(data: Record<string, unknown>): void {
    this.logger.error(data);
  }

  warn(data: Record<string, unknown>): void {
    this.logger.warn(data);
  }

  debug(data: Record<string, unknown>): void {
    this.logger.debug(data);
  }

  verbose(data: Record<string, unknown>): void {
    this.logger.trace(data);
  }
}
