import { ConfigifyModule } from '@itgorillaz/configify';
import { Module } from '@nestjs/common';
import { HttpClientModule } from 'libs/infrastructure/http/http-client.module';

import { EmailTransportToken } from './core/email-transport.interface';
import { EmailToken } from './core/email.interface';
import { NodemailerService } from './infrastructure/providers/nodemailer.provider';
import { EmailService } from './infrastructure/services/email.service';
import { EmailKafkaController } from './interface/email.cafka.controller';
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
  ],
  controllers: [EmailController, EmailKafkaController],
})
export class AppModule {}
