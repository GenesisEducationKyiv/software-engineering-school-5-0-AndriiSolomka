import { Module } from '@nestjs/common';

import { kafkaProvider } from './kafka.producer';

@Module({
  providers: [kafkaProvider],
  exports: [kafkaProvider],
})
export class KafkaPublisherModule {}
