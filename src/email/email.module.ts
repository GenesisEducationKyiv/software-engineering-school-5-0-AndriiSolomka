import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { NodemailerModule } from 'src/nodemailer/nodemailer.module';
import { EmailTransportToken } from './interfaces/email-transport.interface';
import { NodemailerService } from 'src/nodemailer/nodemailer.service';

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
