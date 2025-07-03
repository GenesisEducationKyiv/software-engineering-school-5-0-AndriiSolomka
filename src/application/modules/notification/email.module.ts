import { Module } from '@nestjs/common';
import { EmailTransportToken } from 'src/core/abstracts/email/email-transport.interface';
import { EmailService } from 'src/infrastructure/email/email.service';
import { NodemailerService } from 'src/infrastructure/email/nodemailer.service';

import { NodemailerModule } from './nodemailer.module';

@Module({
  imports: [NodemailerModule],
  providers: [
    EmailService,
    {
      provide: EmailTransportToken,
      useClass: NodemailerService,
    },
  ],
  exports: [EmailService],
})
export class EmailModule {}
