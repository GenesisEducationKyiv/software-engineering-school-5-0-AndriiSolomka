import { Inject, Injectable } from '@nestjs/common';
import {
  LoggerInterface,
  LoggerToken,
} from 'libs/core/logger/logger.interface';

import {
  SubscriptionRepositoryInterface,
  SubscriptionRepositoryToken,
} from '../../core/subscription/subscription-repository.interface';
import { LoggingSubscriptionServiceDecorator } from '../decorators/subscription-logging.decorator';
import { LoggingSubscriptionRepositoryDecorator } from '../decorators/subsription.prisma.decorator';
import { SubscriptionService } from '../services/subscription.service';

@Injectable()
export class SubscriptionFactory {
  constructor(
    @Inject(SubscriptionRepositoryToken)
    private readonly repo: SubscriptionRepositoryInterface,
    @Inject(LoggerToken)
    private readonly logger: LoggerInterface,
  ) {}

  create() {
    const loggedRepo = new LoggingSubscriptionRepositoryDecorator(
      this.repo,
      this.logger,
    );

    return new LoggingSubscriptionServiceDecorator(
      new SubscriptionService(loggedRepo),
      this.logger,
    );
  }
}
