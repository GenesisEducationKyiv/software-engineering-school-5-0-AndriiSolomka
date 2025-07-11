import { ConflictException } from '@nestjs/common';

export class SubscriptionAlreadyExistsException extends ConflictException {
  constructor(email: string, city: string) {
    super(
      `Subscription with email "${email}" for city "${city}" already exists.`,
    );
  }
}
