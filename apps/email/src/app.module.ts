import { ConfigifyModule } from '@itgorillaz/configify';
import { Module } from '@nestjs/common';
import { EMAIL_EVENTS } from 'libs/common/events/email';
import { HttpClientModule } from 'libs/infrastructure/http/http-client.module';
import { createKafkaConsumerProvider } from 'libs/infrastructure/kafka/kafka.consumer';

import { EmailTransportToken } from './core/email-transport.interface';
import { EmailPayload, EmailToken } from './core/email.interface';
import { NodemailerService } from './infrastructure/providers/nodemailer.provider';
import { EmailService } from './infrastructure/services/email.service';
import { EmailController } from './interface/email.controller';

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
    createKafkaConsumerProvider<EmailPayload>(EMAIL_EVENTS.SENDED, EmailToken),
  ],
  controllers: [EmailController],
})
export class AppModule {}
