import { ConfigifyModule } from '@itgorillaz/configify';
import { Module } from '@nestjs/common';
import { EmailTransportToken } from 'apps/email/src/core/email-transport.interface';
import { EmailToken } from 'apps/email/src/core/email.interface';
import { EmailService } from 'apps/email/src/infrastructure/services/email.service';
import { HttpClientModule } from 'libs/infrastructure/http/http-client.module';

import { NodemailerService } from './infrastructure/providers/nodemailer.provider';
import { EmailApiClient } from './interface/clients/email.client';
import { EmailController } from './interface/controllers/email.controller';

@Module({
  imports: [ConfigifyModule.forRootAsync({}), HttpClientModule],
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
    EmailApiClient,
  ],
  exports: [EmailApiClient],
})
export class InternalEmailModule {}
