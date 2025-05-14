import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { createPinoLogger } from '../utils/logger/logger.factory';
import { HTTP_LOG_FILE_PATH } from '../utils/logger/logger.config';

@Injectable()
export class HttpLoggerService implements NestMiddleware {
  private readonly logger = createPinoLogger(HTTP_LOG_FILE_PATH, true);

  use(req: Request, res: Response, next: NextFunction): void {
    const start = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - start;
      const logData = {
        req: {
          method: req.method,
          url: req.originalUrl,
          query: req.query,
          params: req.params,
          headers: req.headers,
          remoteAddress: req.socket.remoteAddress,
          remotePort: req.socket.remotePort,
        },
        res: {
          statusCode: res.statusCode,
          headers: res.getHeaders(),
        },
        responseTime: duration,
      };
      this.logger.info({ ...logData }, 'request completed');
    });

    next();
  }
}
