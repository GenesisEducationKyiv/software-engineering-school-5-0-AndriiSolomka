import { Module } from '@nestjs/common';
import { HttpClientModule } from 'src/application/modules/infrastructure/http-client.module';
import { EmailModule } from 'src/application/modules/notification/email.module';
import { EmailToken } from 'src/core/abstracts/email/email.interface';
import { EmailService } from 'src/infrastructure/email/email.service';

import { EmailInternalController } from '../../controllers/email/email.controller';
import { EmailApiClient } from '../../services/email/email.service';

@Module({
  imports: [EmailModule, HttpClientModule],
  controllers: [EmailInternalController],
  providers: [
    {
      provide: EmailToken,
      useExisting: EmailService,
    },
    EmailApiClient,
  ],
  exports: [EmailApiClient],
})
export class InternalEmailModule {}
