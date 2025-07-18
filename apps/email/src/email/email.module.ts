import { ConfigifyModule } from '@itgorillaz/configify';
import { Module } from '@nestjs/common';
import { EmailTransportToken } from 'apps/email/src/email/core/email-transport.interface';
import { EmailToken } from 'apps/email/src/email/core/email.interface';
import { HttpClientModule } from 'libs/infrastructure/http/http-client.module';

import { KafkaConsumerModule } from '../kafka/kafka.module';
import { NodemailerService } from './infrastructure/providers/nodemailer.provider';
import { EmailService } from './infrastructure/services/email.service';
import { EmailController } from './interface/email.controller';

@Module({
  imports: [
    ConfigifyModule.forRootAsync({}),
    HttpClientModule,
    KafkaConsumerModule,
  ],
  controllers: [EmailController],
  providers: [
    {
      provide: EmailTransportToken,
      useClass: NodemailerService,
    },
    {
      provide: EmailToken,
      useClass: EmailService,
    },
  ],
})
export class EmailModule {}
