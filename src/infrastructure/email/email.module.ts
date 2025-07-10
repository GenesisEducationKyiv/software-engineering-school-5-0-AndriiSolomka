import { Module } from '@nestjs/common';
import { EmailTransportToken } from 'src/core/abstracts/email/email-transport.interface';
import { EmailToken } from 'src/core/abstracts/email/email.interface';
import { EmailService } from 'src/infrastructure/email/services/email.service';
import { HttpClientModule } from 'src/libs/http/http-client.module';

import { EmailApiClient } from './api/clients/email.client';
import { EmailInternalController } from './api/controllers/email.controller';
import { NodemailerService } from './providers/nodemailer.provider';

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
