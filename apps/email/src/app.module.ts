import { ConfigifyModule } from '@itgorillaz/configify';
import { Module } from '@nestjs/common';
import { EMAIL_EVENTS } from 'libs/common/events/email';
import { HttpClientModule } from 'libs/infrastructure/http/http-client.module';
import { createKafkaConsumerProvider } from 'libs/infrastructure/kafka/kafka.consumer';

import { EmailTransportToken } from './core/email-transport.interface';
import { EmailPayload, EmailToken } from './core/email.interface';
import { NodemailerService } from './infrastructure/providers/nodemailer.provider';
import { EmailKafkaConsumer } from './infrastructure/services/email.handler';
import { EmailService } from './infrastructure/services/email.service';
import { EmailController } from './interface/email.controller';

export const EmailKafkaToken = Symbol('EmailKafkaHandler');

@Module({
  imports: [ConfigifyModule.forRootAsync({}), HttpClientModule],
  providers: [
    {
      provide: EmailTransportToken,
      useClass: NodemailerService,
    },
    {
      provide: EmailToken,
      useClass: EmailService,
    },

    {
      provide: EmailKafkaToken,
      useClass: EmailKafkaConsumer,
    },

    createKafkaConsumerProvider<EmailPayload>(
      EMAIL_EVENTS.SENDED,
      EmailKafkaToken,
    ),
  ],
  controllers: [EmailController],
})
export class AppModule {}
