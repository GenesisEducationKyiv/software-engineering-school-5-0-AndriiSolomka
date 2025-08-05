import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import {
  LoggerInterface,
  LoggerToken,
} from 'libs/core/logger/logger.interface';

import { KAFKA_PUBLISHER } from '../kafka/kafka.module';
import { MetricsPublisherDecorator } from './infrastructure/decorators/metrics-publisher.decorator';
import { NotificationMetrics } from './infrastructure/metrics/notification-metrics';
import { EmailPublisher } from './infrastructure/publisher/email.publisher';

@Injectable()
export class EmailPublisherFactory {
  constructor(
    @Inject(LoggerToken)
    private readonly logger: LoggerInterface,
    @Inject(KAFKA_PUBLISHER)
    private readonly kafkaPublisher: ClientKafka,
    private readonly metrics: NotificationMetrics,
  ) {}

  create() {
    const original = new EmailPublisher(this.logger, this.kafkaPublisher);
    return new MetricsPublisherDecorator(original, this.metrics);
  }
}
