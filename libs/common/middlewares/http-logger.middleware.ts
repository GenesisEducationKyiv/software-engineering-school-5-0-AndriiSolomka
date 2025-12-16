import { Injectable, NestMiddleware } from '@nestjs/common';
import {
  HTTP_LOG_FILE_PATH,
  createPinoLogger,
  logHttpRequest,
} from '@weather-utils/core';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
  private readonly logger = createPinoLogger(HTTP_LOG_FILE_PATH, true);

  use(req: Request, res: Response, next: NextFunction): void {
    const start = Date.now();

    res.on('finish', () => {
      logHttpRequest(req, res, start, this.logger);
    });

    next();
  }
}
