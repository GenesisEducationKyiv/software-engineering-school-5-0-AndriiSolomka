import * as fs from 'fs';
import { Injectable, LoggerService } from '@nestjs/common';
import pino, { Logger, multistream } from 'pino';
import { LOG_FILE_PATH } from '../utils/logger/logger.config';

@Injectable()
export class AppLogger implements LoggerService {
  private readonly logger: Logger;

  constructor() {
    const streams = [
      { stream: fs.createWriteStream(LOG_FILE_PATH, { flags: 'a' }) },
      {
        stream: pino.transport({
          target: 'pino-pretty',
          options: { colorize: true },
        }) as NodeJS.WritableStream,
      },
    ];
    this.logger = pino(
      {
        level: 'info',
        timestamp: pino.stdTimeFunctions.isoTime,
      },
      multistream(streams),
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
