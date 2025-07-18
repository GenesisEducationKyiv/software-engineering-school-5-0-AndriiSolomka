import { ConfigifyModule } from '@itgorillaz/configify';
import { Module } from '@nestjs/common';
import { HttpClientModule } from 'libs/infrastructure/http/http-client.module';

import { EmailModule } from './email/email.module';
import { KafkaConsumerModule } from './kafka/kafka.module';

@Module({
  imports: [
    ConfigifyModule.forRootAsync({}),
    HttpClientModule,
    KafkaConsumerModule,
    EmailModule,
  ],
})
export class AppModule {}
