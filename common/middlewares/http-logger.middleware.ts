import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { logHttpRequest } from 'src/libs/utils/logger/http-logger';
import { HTTP_LOG_FILE_PATH } from 'src/libs/utils/logger/logger.config';
import { createPinoLogger } from 'src/libs/utils/logger/logger.factory';

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
