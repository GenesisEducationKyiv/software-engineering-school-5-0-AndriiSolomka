import { Module } from '@nestjs/common';

import { kafkaConsumerProvider } from './kafka.consumer';
import { EmailModule } from '../../email.module';

@Module({
  imports: [EmailModule],
  providers: [kafkaConsumerProvider],
  exports: [kafkaConsumerProvider],
})
export class KafkaConsumerModule {}
