import { ConfigifyModule } from '@itgorillaz/configify';
import { Module } from '@nestjs/common';
import { HttpClientModule } from 'libs/infrastructure/http/http-client.module';
import { LoggerModule } from 'libs/infrastructure/logger/logger.module';

import { EmailTransportToken } from './core/email-transport.interface';
import { EmailToken } from './core/email.interface';
import { EmailFactory } from './email.factory';
import { NodemailerService } from './infrastructure/providers/nodemailer.provider';
import { EmailKafkaController } from './interface/email.cafka.controller';
import { EmailController } from './interface/email.controller';

@Module({
  imports: [ConfigifyModule.forRootAsync({}), HttpClientModule, LoggerModule],
  providers: [
    {
      provide: EmailTransportToken,
      useClass: NodemailerService,
    },
    EmailFactory,
    {
      provide: EmailToken,
      useFactory: (factory: EmailFactory) => factory.create(),
      inject: [EmailFactory],
    },
  ],
  controllers: [EmailController, EmailKafkaController],
})
export class AppModule {}
