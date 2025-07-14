import { status as GrpcStatus, ServiceError } from '@grpc/grpc-js';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Response } from 'express';

interface GrpcErrorPayload {
  code: number;
  message: string;
}

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

    let code = GrpcStatus.UNKNOWN;
    let message = 'Internal server error';

    if (exception instanceof RpcException) {
      const error = exception.getError() as GrpcErrorPayload;
      code = error.code ?? GrpcStatus.UNKNOWN;
      message = error.message ?? message;
    } else if (this.isGrpcServiceError(exception)) {
      code = exception.code;
      message = exception.details ?? exception.message ?? message;
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    const httpStatus =
      GrpcExceptionFilter.grpcToHttpMap[code] ??
      HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(httpStatus).json({
      statusCode: httpStatus,
      message,
    });
  }

  private isGrpcServiceError(error: unknown): error is ServiceError {
    return (
      typeof error === 'object' &&
      error !== null &&
      typeof (error as ServiceError).code === 'number' &&
      typeof (error as ServiceError).message === 'string'
    );
  }
}
