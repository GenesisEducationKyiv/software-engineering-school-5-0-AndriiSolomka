import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import {
  LoggerInterface,
  LoggerToken,
} from 'libs/core/logger/logger.interface';

import { KAFKA_PUBLISHER } from '../kafka/kafka.module';
import { LoggingEmailPublisherDecorator } from './infrastructure/decorators/publisher-logging.decorator';
import { EmailPublisher } from './infrastructure/publisher/email.publisher';

@Injectable()
export class EmailPublisherFactory {
  constructor(
    @Inject(LoggerToken)
    private readonly logger: LoggerInterface,
    @Inject(KAFKA_PUBLISHER)
    private readonly kafkaPublisher: ClientKafka,
  ) {}

  create() {
    const original = new EmailPublisher(this.kafkaPublisher);
    return new LoggingEmailPublisherDecorator(original, this.logger);
  }
}
