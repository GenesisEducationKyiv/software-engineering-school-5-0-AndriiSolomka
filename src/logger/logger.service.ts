import { Injectable, LoggerService } from '@nestjs/common';
import pino, { Logger } from 'pino';
import { LOG_FILE_PATH } from '../utils/logger/logger.config';

@Injectable()
export class AppLogger implements LoggerService {
  private readonly logger: Logger;

  constructor() {
    this.logger = pino(
      {
        level: 'info',
        transport: {
          target: 'pino-pretty',
          options: { colorize: true },
        },
      },
      pino.destination(LOG_FILE_PATH),
    );
  }

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
