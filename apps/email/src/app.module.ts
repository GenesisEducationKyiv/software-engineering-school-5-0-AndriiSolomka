import { ConfigifyModule } from '@itgorillaz/configify';
import { Module } from '@nestjs/common';
import { HttpClientModule } from 'libs/infrastructure/http/http-client.module';

import { ConsumerModule } from './consumer/consumer.module';
import { EmailModule } from './email/email.module';

export const EmailKafkaToken = Symbol('EmailKafkaHandler');

@Module({
  imports: [
    ConfigifyModule.forRootAsync({}),
    EmailModule,
    HttpClientModule,
    ConsumerModule,
  ],
})
export class AppModule {}
