import { status } from '@grpc/grpc-js';
import { RpcException } from '@nestjs/microservices';

export class SubscriptionAlreadyExistsException extends RpcException {
  constructor(email: string, city: string) {
    super({
      code: status.ALREADY_EXISTS,
      message: `Subscription with email "${email}" for city "${city}" already exists.`,
    });
  }
}

export class TokenNotFoundException extends RpcException {
  constructor() {
    super({
      code: status.NOT_FOUND,
      message: 'Token not found',
    });
  }
}
