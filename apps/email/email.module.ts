import { Module } from '@nestjs/common';
import { EmailTransportToken } from 'apps/email/src/core/email-transport.interface';
import { EmailToken } from 'apps/email/src/core/email.interface';
import { EmailService } from 'apps/email/src/infrastructure/services/email.service';
import { HttpClientModule } from 'libs/infrastructure/http/http-client.module';

import { NodemailerService } from './src/infrastructure/providers/nodemailer.provider';
import { EmailApiClient } from './src/interface/clients/email.client';
import { EmailInternalController } from './src/interface/controllers/email.controller';

@Module({
  imports: [HttpClientModule],
  controllers: [EmailInternalController],
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
