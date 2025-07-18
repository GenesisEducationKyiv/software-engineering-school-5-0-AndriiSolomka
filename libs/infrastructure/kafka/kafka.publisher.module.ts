import { Module } from '@nestjs/common';

import { KafkaPublisherService } from './kafka.publisher';

@Module({
  providers: [KafkaPublisherService],
  exports: [KafkaPublisherService],
})
export class KafkaPublisherModule {}
