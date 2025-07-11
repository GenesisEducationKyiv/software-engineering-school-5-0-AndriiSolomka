import { Module } from '@nestjs/common';
import { EmailTransportToken } from 'apps/weather_api/src/infrastructure/email/core/email-transport.interface';
import { EmailToken } from 'apps/weather_api/src/infrastructure/email/core/email.interface';
import { EmailService } from 'apps/weather_api/src/infrastructure/email/infrastructure/services/email.service';
import { HttpClientModule } from 'libs/infrastructure/http/http-client.module';

import { NodemailerService } from './infrastructure/providers/nodemailer.provider';
import { EmailApiClient } from './interface/clients/email.client';
import { EmailInternalController } from './interface/controllers/email.controller';

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
