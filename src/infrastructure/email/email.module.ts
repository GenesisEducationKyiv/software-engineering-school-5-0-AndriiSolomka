import { Module } from '@nestjs/common';
import { HttpClientModule } from 'src/application/modules/infrastructure/http-client.module';
import { EmailTransportToken } from 'src/core/abstracts/email/email-transport.interface';
import { EmailToken } from 'src/core/abstracts/email/email.interface';
import { EmailService } from 'src/infrastructure/email/services/email.service';

import { EmailApiClient } from './clients/email-api.client';
import { EmailInternalController } from './controllers/email.controller';
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
