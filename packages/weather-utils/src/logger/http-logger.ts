import { Logger } from 'pino';

export interface HttpRequest {
  method: string;
  url: string;
  query?: unknown;
  params?: unknown;
  headers?: unknown;
  remoteAddress?: string;
  remotePort?: number;
}

export interface HttpResponse {
  statusCode: number;
  headers?: unknown;
}

export interface HttpLogData {
  req: HttpRequest;
  res: HttpResponse;
  responseTime: number;
}

/**
 * Logs HTTP request/response data
 * @param req - Request object (Express-like)
 * @param res - Response object (Express-like)
 * @param start - Request start timestamp
 * @param logger - Pino logger instance
 */
export function logHttpRequest(
  req: {
    method: string;
    originalUrl: string;
    query?: unknown;
    params?: unknown;
    headers?: unknown;
    socket: { remoteAddress?: string; remotePort?: number };
  },
  res: {
    statusCode: number;
    getHeaders?: () => unknown;
  },
  start: number,
  logger: Logger,
): void {
  const duration = Date.now() - start;

  const logData: HttpLogData = {
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
      headers: res.getHeaders?.(),
    },
    responseTime: duration,
  };

  logger.info({ ...logData }, 'request completed');
}
