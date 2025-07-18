import { Module } from '@nestjs/common';

import { kafkaPublisherProvider } from './kafka.publisher';

@Module({
  providers: [kafkaPublisherProvider],
  exports: [kafkaPublisherProvider],
})
export class KafkaPublisherModule {}
