import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { createPinoLogger } from '../utils/logger/logger.factory';
import { HTTP_LOG_FILE_PATH } from '../utils/logger/logger.config';
import { logHttpRequest } from 'src/utils/logger/http-logger';

@Injectable()
export class HttpLoggerService implements NestMiddleware {
  private readonly logger = createPinoLogger(HTTP_LOG_FILE_PATH, true);

  use(req: Request, res: Response, next: NextFunction): void {
    const start = Date.now();

    res.on('finish', () => {
      logHttpRequest(req, res, start, this.logger);
    });

    next();
  }
}
