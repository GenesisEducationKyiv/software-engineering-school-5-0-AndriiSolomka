import { status as GrpcStatus, ServiceError } from '@grpc/grpc-js';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Response } from 'express';

@Catch()
export class GrpcExceptionFilter implements ExceptionFilter {
  private static readonly grpcToHttpMap: Record<number, HttpStatus> = {
    [GrpcStatus.OK]: HttpStatus.OK,
    [GrpcStatus.CANCELLED]: HttpStatus.REQUEST_TIMEOUT,
    [GrpcStatus.UNKNOWN]: HttpStatus.INTERNAL_SERVER_ERROR,
    [GrpcStatus.INVALID_ARGUMENT]: HttpStatus.BAD_REQUEST,
    [GrpcStatus.DEADLINE_EXCEEDED]: HttpStatus.REQUEST_TIMEOUT,
    [GrpcStatus.NOT_FOUND]: HttpStatus.NOT_FOUND,
    [GrpcStatus.ALREADY_EXISTS]: HttpStatus.CONFLICT,
    [GrpcStatus.PERMISSION_DENIED]: HttpStatus.FORBIDDEN,
    [GrpcStatus.UNAUTHENTICATED]: HttpStatus.UNAUTHORIZED,
    [GrpcStatus.RESOURCE_EXHAUSTED]: HttpStatus.TOO_MANY_REQUESTS,
    [GrpcStatus.FAILED_PRECONDITION]: HttpStatus.PRECONDITION_FAILED,
    [GrpcStatus.ABORTED]: HttpStatus.CONFLICT,
    [GrpcStatus.OUT_OF_RANGE]: HttpStatus.BAD_REQUEST,
    [GrpcStatus.UNIMPLEMENTED]: HttpStatus.NOT_IMPLEMENTED,
    [GrpcStatus.INTERNAL]: HttpStatus.INTERNAL_SERVER_ERROR,
    [GrpcStatus.UNAVAILABLE]: HttpStatus.SERVICE_UNAVAILABLE,
    [GrpcStatus.DATA_LOSS]: HttpStatus.INTERNAL_SERVER_ERROR,
  };

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // 1. Если это стандартная HTTP-ошибка NestJS — вернуть как есть
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const res = exception.getResponse();
      response
        .status(status)
        .json(typeof res === 'string' ? { message: res } : res);
      return;
    }

    // 2. gRPC ServiceError (от клиента)
    if (
      typeof exception === 'object' &&
      exception !== null &&
      'code' in exception &&
      typeof (exception as any).code === 'number'
    ) {
      const grpcError = exception as Partial<ServiceError> & {
        message?: string;
      };
      const grpcCode = grpcError.code ?? GrpcStatus.UNKNOWN;

      let grpcMessage = '';
      if (grpcError.details) {
        grpcMessage = grpcError.details;
      } else if (grpcError.message) {
        const idx = grpcError.message.indexOf(':');
        grpcMessage =
          idx !== -1
            ? grpcError.message.slice(idx + 1).trim()
            : grpcError.message;
      } else {
        grpcMessage = 'Unexpected error';
      }

      const httpStatus =
        GrpcExceptionFilter.grpcToHttpMap[grpcCode] ??
        HttpStatus.INTERNAL_SERVER_ERROR;

      response.status(httpStatus).json({
        statusCode: httpStatus,
        message: grpcMessage,
      });
      return;
    }

    // 3. RpcException (от микросервиса)
    if (exception instanceof RpcException) {
      const error: any = exception.getError();
      const codeToHttp: Record<number, number> = {
        3: HttpStatus.BAD_REQUEST,
        5: HttpStatus.NOT_FOUND,
        6: HttpStatus.CONFLICT,
        7: HttpStatus.FORBIDDEN,
        16: HttpStatus.UNAUTHORIZED,
      };

      const status =
        error?.statusCode ??
        (typeof error?.code === 'number'
          ? codeToHttp[error.code]
          : undefined) ??
        HttpStatus.INTERNAL_SERVER_ERROR;

      response.status(status).json({
        statusCode: status,
        message: error?.message || 'Internal server error',
        error: error?.error || 'RpcException',
      });
      return;
    }

    Logger.error(exception);
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
    });
  }
}
