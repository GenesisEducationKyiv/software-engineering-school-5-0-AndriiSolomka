import { Module } from '@nestjs/common';
import { EMAIL_EVENTS } from 'libs/common/events/email';
import { HttpClientModule } from 'libs/infrastructure/http/http-client.module';
import { createKafkaConsumerProvider } from 'libs/infrastructure/kafka/kafka.consumer';

import { EmailModule } from '../email/email.module';
import { EmailKafkaConsumer } from './services/email.service';
import { EmailPayload } from '../email/core/email.interface';

export const EmailKafkaToken = Symbol('EmailKafkaHandler');

@Module({
  imports: [EmailModule, HttpClientModule],
  providers: [
    {
      provide: EmailKafkaToken,
      useClass: EmailKafkaConsumer,
    },

    createKafkaConsumerProvider<EmailPayload>(
      EMAIL_EVENTS.SENDED,
      EmailKafkaToken,
    ),
  ],
})
export class ConsumerModule {}
