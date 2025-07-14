import { status as GrpcStatus, ServiceError } from '@grpc/grpc-js';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Response } from 'express';

import { GRPC_TO_HTTP_MAP } from './grpc-to-http.map';

const DEFAULT_ERROR_MESSAGE = 'Internal server error';
const DEFAULT_ERROR_NAME = 'UnknownError';

@Catch()
export class GrpcExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const res = host.switchToHttp().getResponse<Response>();

    if (exception instanceof HttpException) {
      this.handleHttpException(exception, res);
    }

    if (this.isGrpcError(exception)) {
      this.handleGrpcError(exception, res);
    }

    if (exception instanceof RpcException) {
      this.handleRpcException(exception, res);
    }

    this.handleUnknownError(res);
  }

  private handleHttpException(exception: HttpException, res: Response): void {
    const status = exception.getStatus();
    const response = exception.getResponse();

    res
      .status(status)
      .json(
        typeof response === 'string'
          ? { statusCode: status, message: response, error: exception.name }
          : { ...response, statusCode: status },
      );
  }

  private handleGrpcError(error: ServiceError, res: Response): void {
    const { code = GrpcStatus.UNKNOWN, message = '', details } = error;
    const status = this.grpcToHttp(code) ?? HttpStatus.INTERNAL_SERVER_ERROR;

    res.status(status).json({
      statusCode: status,
      message: details || this.extractMessage(message),
      error: 'GrpcError',
    });
  }

  private handleRpcException(exception: RpcException, res: Response): void {
    const error = exception.getError() as {
      statusCode?: number;
      code?: number;
      message?: string;
      error?: string;
    };

    const status =
      error?.statusCode ??
      this.grpcToHttp(error?.code) ??
      HttpStatus.INTERNAL_SERVER_ERROR;

    res.status(status).json({
      statusCode: status,
      message: error?.message || DEFAULT_ERROR_MESSAGE,
      error: error?.error || 'RpcException',
    });
  }

  private handleUnknownError(res: Response): void {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: DEFAULT_ERROR_MESSAGE,
      error: DEFAULT_ERROR_NAME,
    });
  }

  private isGrpcError(e: unknown): e is ServiceError {
    return (
      typeof e === 'object' &&
      e !== null &&
      'code' in e &&
      typeof (e as ServiceError).code === 'number'
    );
  }

  private extractMessage(message: string): string {
    const idx = message.indexOf(':');
    return idx >= 0
      ? message.slice(idx + 1).trim()
      : message || DEFAULT_ERROR_MESSAGE;
  }

  private grpcToHttp(code?: number): HttpStatus | undefined {
    return code !== undefined ? GRPC_TO_HTTP_MAP[code] : undefined;
  }
}
